import { describe, it, expect } from 'vitest';

// Test real-world scenarios to verify accuracy
describe('Real-World Scenario Tests', () => {
  const baseMetrics = {
    emailsPerMonth: 15000,
    responseRate: 0.02, // 2%
    positiveReplyRate: 0.05, // 5%
    callBookingRate: 0.4, // 40%
  };

  const calculateScenario = (monthlyRetainer: number, closeRate: number, ltv: number, growthType: string = 'linear') => {
    const getGrowthAdjustedMetrics = (month: number) => {
      let adjustedEmails = baseMetrics.emailsPerMonth;
      let adjustedCloseRate = closeRate / 100;
      let adjustedNewClients = 0;

      switch (growthType) {
        case 'scaling':
          adjustedEmails = baseMetrics.emailsPerMonth * Math.pow(1.2, month - 1);
          adjustedNewClients = (adjustedEmails * baseMetrics.responseRate * baseMetrics.positiveReplyRate * baseMetrics.callBookingRate) * adjustedCloseRate;
          break;
        case 'improving':
          adjustedCloseRate = Math.min((closeRate + (month - 1) * 2) / 100, 0.5);
          adjustedNewClients = (baseMetrics.emailsPerMonth * baseMetrics.responseRate * baseMetrics.positiveReplyRate * baseMetrics.callBookingRate) * adjustedCloseRate;
          break;
        case 'linear':
        default:
          adjustedNewClients = (baseMetrics.emailsPerMonth * baseMetrics.responseRate * baseMetrics.positiveReplyRate * baseMetrics.callBookingRate) * adjustedCloseRate;
          break;
      }

      return { adjustedEmails, adjustedCloseRate, adjustedNewClients };
    };

    // Calculate 6-month projections
    const projections = [];
    let totalClients = 0;
    let totalRevenue = 0;
    let totalCost = 0;

    for (let month = 1; month <= 6; month++) {
      const { adjustedNewClients } = getGrowthAdjustedMetrics(month);
      totalClients += adjustedNewClients;
      totalRevenue += adjustedNewClients * ltv;
      totalCost += monthlyRetainer;
      
      const cumulativeProfit = totalRevenue - totalCost;
      const roi = (cumulativeProfit / totalCost) * 100;
      
      projections.push({
        month,
        newClientsThisMonth: adjustedNewClients,
        cumulativeClients: totalClients,
        cumulativeRevenue: totalRevenue,
        cumulativeCost: totalCost,
        cumulativeProfit,
        roi
      });
    }

    return {
      monthly: projections[0], // First month
      sixMonth: projections[5], // Sixth month
      projections
    };
  };

  describe('Conservative SaaS Scenario', () => {
    const scenario = calculateScenario(2500, 15, 12000, 'linear');
    
    it('should calculate conservative SaaS metrics correctly', () => {
      // 15% close rate, $12k LTV, $2.5k retainer
      expect(scenario.monthly.newClientsThisMonth).toBeCloseTo(0.9, 1); // 1.5 * 0.6 (15% vs 25%)
      expect(scenario.monthly.cumulativeRevenue).toBeCloseTo(10800, 0); // 0.9 * 12000
      expect(scenario.monthly.cumulativeProfit).toBeCloseTo(8300, 0); // 10800 - 2500
      expect(scenario.monthly.roi).toBeCloseTo(332, 0); // (8300 / 2500) * 100
    });

    it('should show 6-month conservative SaaS results', () => {
      expect(scenario.sixMonth.cumulativeClients).toBeCloseTo(5.4, 1); // 0.9 * 6
      expect(scenario.sixMonth.cumulativeRevenue).toBeCloseTo(64800, 0); // 5.4 * 12000
      expect(scenario.sixMonth.cumulativeProfit).toBeCloseTo(49800, 0); // 64800 - 15000
      expect(scenario.sixMonth.roi).toBeCloseTo(332, 0); // Same ROI each month
    });
  });

  describe('High-Value B2B Scenario', () => {
    const scenario = calculateScenario(5000, 30, 50000, 'linear');
    
    it('should calculate high-value B2B metrics correctly', () => {
      // 30% close rate, $50k LTV, $5k retainer
      expect(scenario.monthly.newClientsThisMonth).toBeCloseTo(1.8, 1); // 1.5 * 1.2 (30% vs 25%)
      expect(scenario.monthly.cumulativeRevenue).toBeCloseTo(90000, 0); // 1.8 * 50000
      expect(scenario.monthly.cumulativeProfit).toBeCloseTo(85000, 0); // 90000 - 5000
      expect(scenario.monthly.roi).toBeCloseTo(1700, 0); // (85000 / 5000) * 100
    });

    it('should show 6-month high-value B2B results', () => {
      expect(scenario.sixMonth.cumulativeClients).toBeCloseTo(10.8, 1); // 1.8 * 6
      expect(scenario.sixMonth.cumulativeRevenue).toBeCloseTo(540000, 0); // 10.8 * 50000
      expect(scenario.sixMonth.cumulativeProfit).toBeCloseTo(510000, 0); // 540000 - 30000
      expect(scenario.sixMonth.roi).toBeCloseTo(1700, 0); // Same ROI each month
    });
  });

  describe('Scaling Volume Scenario', () => {
    const scenario = calculateScenario(2500, 25, 15000, 'scaling');
    
    it('should show increasing clients with scaling volume', () => {
      expect(scenario.projections[0].newClientsThisMonth).toBe(1.5); // Month 1
      expect(scenario.projections[1].newClientsThisMonth).toBe(1.8); // Month 2: 1.5 * 1.2
      expect(scenario.projections[2].newClientsThisMonth).toBe(2.16); // Month 3: 1.8 * 1.2
      expect(scenario.projections[5].newClientsThisMonth).toBeCloseTo(3.73, 1); // Month 6: 1.5 * 1.2^5
    });

    it('should show exponential revenue growth', () => {
      expect(scenario.sixMonth.cumulativeClients).toBeCloseTo(14.9, 1); // Sum of all months
      expect(scenario.sixMonth.cumulativeRevenue).toBeCloseTo(223423, 0); // Actual calculated value
      expect(scenario.sixMonth.cumulativeProfit).toBeCloseTo(208423, 0); // 223423 - 15000
    });
  });

  describe('Improving Conversions Scenario', () => {
    const scenario = calculateScenario(2500, 20, 15000, 'improving');
    
    it('should show improving close rates over time', () => {
      expect(scenario.projections[0].newClientsThisMonth).toBeCloseTo(1.2, 1); // Month 1: 20% close rate
      expect(scenario.projections[1].newClientsThisMonth).toBeCloseTo(1.32, 1); // Month 2: 22% close rate
      expect(scenario.projections[2].newClientsThisMonth).toBeCloseTo(1.44, 1); // Month 3: 24% close rate
      expect(scenario.projections[5].newClientsThisMonth).toBeCloseTo(1.8, 1); // Month 6: 30% close rate
    });

    it('should show cumulative improvement', () => {
      expect(scenario.sixMonth.cumulativeClients).toBeCloseTo(9.0, 1); // Sum of all months
      expect(scenario.sixMonth.cumulativeRevenue).toBeCloseTo(135000, 0); // 9.0 * 15000
      expect(scenario.sixMonth.cumulativeProfit).toBeCloseTo(120000, 0); // 135000 - 15000
    });
  });

  describe('Edge Cases', () => {
    it('should handle very low close rates', () => {
      const scenario = calculateScenario(2500, 5, 15000, 'linear');
      expect(scenario.monthly.newClientsThisMonth).toBeCloseTo(0.3, 1); // 1.5 * 0.2 (5% vs 25%)
      expect(scenario.monthly.cumulativeProfit).toBeCloseTo(2000, 0); // 4500 - 2500
      expect(scenario.monthly.roi).toBeCloseTo(80, 0); // (2000 / 2500) * 100
    });

    it('should handle very high retainers', () => {
      const scenario = calculateScenario(10000, 25, 15000, 'linear');
      expect(scenario.monthly.cumulativeProfit).toBe(12500); // 22500 - 10000
      expect(scenario.monthly.roi).toBe(125); // (12500 / 10000) * 100
    });

    it('should handle very high LTV', () => {
      const scenario = calculateScenario(2500, 25, 100000, 'linear');
      expect(scenario.monthly.cumulativeRevenue).toBe(150000); // 1.5 * 100000
      expect(scenario.monthly.cumulativeProfit).toBe(147500); // 150000 - 2500
      expect(scenario.monthly.roi).toBe(5900); // (147500 / 2500) * 100
    });
  });

  describe('ROI Validation', () => {
    it('should maintain consistent ROI for linear growth', () => {
      const scenario = calculateScenario(2500, 25, 15000, 'linear');
      
      // ROI should be the same for each month in linear growth
      scenario.projections.forEach(projection => {
        const expectedROI = ((projection.newClientsThisMonth * 15000 - 2500) / 2500) * 100;
        expect(projection.roi).toBeCloseTo(expectedROI, 0);
      });
    });

    it('should show increasing ROI for scaling growth', () => {
      const scenario = calculateScenario(2500, 25, 15000, 'scaling');
      
      // ROI should increase each month
      for (let i = 1; i < scenario.projections.length; i++) {
        expect(scenario.projections[i].roi).toBeGreaterThan(scenario.projections[i-1].roi);
      }
    });

    it('should show increasing ROI for improving conversions', () => {
      const scenario = calculateScenario(2500, 20, 15000, 'improving');
      
      // ROI should increase each month
      for (let i = 1; i < scenario.projections.length; i++) {
        expect(scenario.projections[i].roi).toBeGreaterThan(scenario.projections[i-1].roi);
      }
    });
  });

  describe('Business Logic Validation', () => {
    it('should never have negative clients', () => {
      const scenarios = [
        calculateScenario(2500, 25, 15000, 'linear'),
        calculateScenario(2500, 25, 15000, 'scaling'),
        calculateScenario(2500, 25, 15000, 'improving')
      ];

      scenarios.forEach(scenario => {
        scenario.projections.forEach(projection => {
          expect(projection.newClientsThisMonth).toBeGreaterThanOrEqual(0);
          expect(projection.cumulativeClients).toBeGreaterThanOrEqual(0);
        });
      });
    });

    it('should have realistic conversion rates', () => {
      const scenario = calculateScenario(2500, 25, 15000, 'improving');
      
      // Close rate should cap at 50%
      scenario.projections.forEach(projection => {
        const impliedCloseRate = (projection.newClientsThisMonth / 6) * 100; // 6 is the base calls booked
        expect(impliedCloseRate).toBeLessThanOrEqual(50);
      });
    });

    it('should show positive ROI for profitable scenarios', () => {
      const scenario = calculateScenario(2500, 25, 15000, 'linear');
      
      scenario.projections.forEach(projection => {
        expect(projection.cumulativeProfit).toBeGreaterThan(0);
        expect(projection.roi).toBeGreaterThan(0);
      });
    });
  });
});
