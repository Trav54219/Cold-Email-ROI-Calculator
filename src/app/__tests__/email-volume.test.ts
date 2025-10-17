import { describe, it, expect } from 'vitest';

// Test the email volume functionality
describe('Email Volume Calculator Tests', () => {
  const baseMetrics = {
    responseRate: 0.02, // 2%
    positiveReplyRate: 0.05, // 5%
    callBookingRate: 0.4, // 40%
  };

  const calculateROI = (monthlyRetainer: number, closeRate: number, ltv: number, emailsPerMonth: number) => {
    const totalReplies = emailsPerMonth * baseMetrics.responseRate;
    const positiveReplies = totalReplies * baseMetrics.positiveReplyRate;
    const callsBooked = positiveReplies * baseMetrics.callBookingRate;
    const newClients = callsBooked * (closeRate / 100);
    const totalRevenue = newClients * ltv;
    const netProfit = totalRevenue - monthlyRetainer;
    const roi = ((totalRevenue - monthlyRetainer) / monthlyRetainer) * 100;

    return {
      emailsPerMonth,
      totalReplies,
      positiveReplies,
      callsBooked,
      newClients,
      totalRevenue,
      netProfit,
      roi
    };
  };

  describe('Email Volume Impact', () => {
    it('should calculate correctly with different email volumes', () => {
      const testCases = [
        {
          name: 'Low volume',
          emailsPerMonth: 5000,
          expected: {
            totalReplies: 100,
            positiveReplies: 5,
            callsBooked: 2,
            newClients: 0.5 // 25% close rate
          }
        },
        {
          name: 'Medium volume',
          emailsPerMonth: 15000,
          expected: {
            totalReplies: 300,
            positiveReplies: 15,
            callsBooked: 6,
            newClients: 1.5 // 25% close rate
          }
        },
        {
          name: 'High volume',
          emailsPerMonth: 30000,
          expected: {
            totalReplies: 600,
            positiveReplies: 30,
            callsBooked: 12,
            newClients: 3.0 // 25% close rate
          }
        }
      ];

      testCases.forEach(testCase => {
        const result = calculateROI(2500, 25, 15000, testCase.emailsPerMonth);
        
        expect(result.emailsPerMonth).toBe(testCase.emailsPerMonth);
        expect(result.totalReplies).toBe(testCase.expected.totalReplies);
        expect(result.positiveReplies).toBe(testCase.expected.positiveReplies);
        expect(result.callsBooked).toBe(testCase.expected.callsBooked);
        expect(result.newClients).toBeCloseTo(testCase.expected.newClients, 1);
      });
    });

    it('should scale revenue proportionally with email volume', () => {
      const baseResult = calculateROI(2500, 25, 15000, 15000);
      const doubleResult = calculateROI(2500, 25, 15000, 30000);
      const halfResult = calculateROI(2500, 25, 15000, 7500);

      // Double emails should double clients and revenue
      expect(doubleResult.newClients).toBeCloseTo(baseResult.newClients * 2, 1);
      expect(doubleResult.totalRevenue).toBeCloseTo(baseResult.totalRevenue * 2, 0);

      // Half emails should halve clients and revenue
      expect(halfResult.newClients).toBeCloseTo(baseResult.newClients * 0.5, 1);
      expect(halfResult.totalRevenue).toBeCloseTo(baseResult.totalRevenue * 0.5, 0);
    });

    it('should show increasing ROI with higher email volumes', () => {
      const testVolumes = [5000, 10000, 15000, 20000, 25000];
      const rois = testVolumes.map(volume => calculateROI(2500, 25, 15000, volume).roi);
      
      // Each higher volume should have higher ROI
      for (let i = 1; i < rois.length; i++) {
        expect(rois[i]).toBeGreaterThan(rois[i-1]);
      }
    });
  });

  describe('Email Volume Edge Cases', () => {
    it('should handle very low email volumes', () => {
      const result = calculateROI(2500, 25, 15000, 100);
      
      expect(result.totalReplies).toBe(2);
      expect(result.positiveReplies).toBe(0.1);
      expect(result.callsBooked).toBeCloseTo(0.04, 2);
      expect(result.newClients).toBeCloseTo(0.01, 2);
      expect(result.totalRevenue).toBeCloseTo(150, 0);
      expect(result.netProfit).toBeCloseTo(-2350, 0);
    });

    it('should handle very high email volumes', () => {
      const result = calculateROI(2500, 25, 15000, 100000);
      
      expect(result.totalReplies).toBe(2000);
      expect(result.positiveReplies).toBe(100);
      expect(result.callsBooked).toBe(40);
      expect(result.newClients).toBeCloseTo(10, 1);
      expect(result.totalRevenue).toBeCloseTo(150000, 0);
      expect(result.netProfit).toBeCloseTo(147500, 0);
    });

    it('should handle zero emails', () => {
      const result = calculateROI(2500, 25, 15000, 0);
      
      expect(result.totalReplies).toBe(0);
      expect(result.positiveReplies).toBe(0);
      expect(result.callsBooked).toBe(0);
      expect(result.newClients).toBe(0);
      expect(result.totalRevenue).toBe(0);
      expect(result.netProfit).toBe(-2500);
      expect(result.roi).toBe(-100);
    });
  });

  describe('Email Volume with Different Close Rates', () => {
    it('should calculate correctly with different close rates and email volumes', () => {
      const testCases = [
        { emailsPerMonth: 10000, closeRate: 10, expectedClients: 0.4 },
        { emailsPerMonth: 10000, closeRate: 25, expectedClients: 1.0 },
        { emailsPerMonth: 10000, closeRate: 50, expectedClients: 2.0 },
        { emailsPerMonth: 20000, closeRate: 10, expectedClients: 0.8 },
        { emailsPerMonth: 20000, closeRate: 25, expectedClients: 2.0 },
        { emailsPerMonth: 20000, closeRate: 50, expectedClients: 4.0 }
      ];

      testCases.forEach(testCase => {
        const result = calculateROI(2500, testCase.closeRate, 15000, testCase.emailsPerMonth);
        expect(result.newClients).toBeCloseTo(testCase.expectedClients, 1);
      });
    });
  });

  describe('Email Volume ROI Scenarios', () => {
    it('should show profitable ROI with sufficient email volume', () => {
      const result = calculateROI(2500, 25, 15000, 15000);
      
      expect(result.newClients).toBeCloseTo(1.5, 1);
      expect(result.totalRevenue).toBe(22500);
      expect(result.netProfit).toBe(20000);
      expect(result.roi).toBe(800);
    });

    it('should show break-even point calculation', () => {
      // Find break-even: need 0.167 clients to break even (2500 / 15000)
      // With 25% close rate, need 0.667 calls booked
      // With 40% call booking rate, need 1.67 leads
      // With 5% lead rate, need 33.4 replies
      // With 2% reply rate, need 1670 emails
      const breakEvenEmails = 1670;
      const result = calculateROI(2500, 25, 15000, breakEvenEmails);
      
      // Should be close to break-even (small profit/loss)
      expect(result.netProfit).toBeLessThan(100); // Small profit/loss
      expect(Math.abs(result.roi)).toBeLessThan(10); // Low ROI magnitude
    });

    it('should show unprofitable with low email volume', () => {
      const result = calculateROI(2500, 25, 15000, 1000);
      
      expect(result.newClients).toBeCloseTo(0.1, 1);
      expect(result.totalRevenue).toBeCloseTo(1500, 0);
      expect(result.netProfit).toBeCloseTo(-1000, 0);
      expect(result.roi).toBeCloseTo(-40, 0);
    });
  });

  describe('Email Volume Growth Projections', () => {
    const calculateProjections = (emailsPerMonth: number, closeRate: number, ltv: number, monthlyRetainer: number, growthType: string) => {
      const projections = [];
      
      for (let month = 1; month <= 6; month++) {
        let adjustedCloseRate = closeRate / 100;
        
        if (growthType === 'improving') {
          adjustedCloseRate = Math.min((closeRate + (month - 1) * 2) / 100, 0.5);
        }
        
        const totalReplies = emailsPerMonth * baseMetrics.responseRate;
        const positiveReplies = totalReplies * baseMetrics.positiveReplyRate;
        const callsBooked = positiveReplies * baseMetrics.callBookingRate;
        const newClients = callsBooked * adjustedCloseRate;
        const revenue = newClients * ltv;
        const profit = revenue - monthlyRetainer;
        
        projections.push({
          month,
          emailsPerMonth,
          newClients,
          revenue,
          profit
        });
      }
      
      return projections;
    };

    it('should maintain constant email volume in linear growth', () => {
      const projections = calculateProjections(15000, 25, 15000, 2500, 'linear');
      
      projections.forEach(projection => {
        expect(projection.emailsPerMonth).toBe(15000);
        expect(projection.newClients).toBeCloseTo(1.5, 1);
      });
    });

    it('should show improving conversions with constant email volume', () => {
      const projections = calculateProjections(15000, 20, 15000, 2500, 'improving');
      
      expect(projections[0].newClients).toBeCloseTo(1.2, 1); // Month 1: 20% close rate
      expect(projections[1].newClients).toBeCloseTo(1.32, 1); // Month 2: 22% close rate
      expect(projections[2].newClients).toBeCloseTo(1.44, 1); // Month 3: 24% close rate
      expect(projections[5].newClients).toBeCloseTo(1.8, 1); // Month 6: 30% close rate
    });

    it('should scale with different email volumes', () => {
      const lowVolume = calculateProjections(5000, 25, 15000, 2500, 'linear');
      const highVolume = calculateProjections(30000, 25, 15000, 2500, 'linear');
      
      // High volume should have 6x the clients of low volume
      expect(highVolume[0].newClients).toBeCloseTo(lowVolume[0].newClients * 6, 1);
      expect(highVolume[0].revenue).toBeCloseTo(lowVolume[0].revenue * 6, 0);
    });
  });

  describe('Email Volume Business Logic', () => {
    it('should never have negative clients', () => {
      const testVolumes = [0, 100, 1000, 10000, 100000];
      
      testVolumes.forEach(volume => {
        const result = calculateROI(2500, 25, 15000, volume);
        expect(result.newClients).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have realistic conversion rates', () => {
      const result = calculateROI(2500, 25, 15000, 15000);
      
      // 2% reply rate
      expect(result.totalReplies / result.emailsPerMonth).toBeCloseTo(0.02, 3);
      
      // 5% lead rate from replies
      expect(result.positiveReplies / result.totalReplies).toBeCloseTo(0.05, 3);
      
      // 40% call booking rate from leads
      expect(result.callsBooked / result.positiveReplies).toBeCloseTo(0.4, 3);
    });

    it('should show increasing profit with higher email volumes', () => {
      const volumes = [5000, 10000, 15000, 20000, 25000];
      const profits = volumes.map(volume => calculateROI(2500, 25, 15000, volume).netProfit);
      
      // Each higher volume should have higher profit
      for (let i = 1; i < profits.length; i++) {
        expect(profits[i]).toBeGreaterThan(profits[i-1]);
      }
    });
  });
});
