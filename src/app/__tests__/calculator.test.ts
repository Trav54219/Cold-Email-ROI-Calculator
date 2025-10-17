import { describe, it, expect } from 'vitest';

// Test the calculator math functions
describe('Cold Email ROI Calculator Math', () => {
  // Test data
  const testCases = [
    {
      name: 'Default scenario',
      monthlyRetainer: 2500,
      closeRate: 25,
      ltv: 15000,
      expected: {
        emailsPerMonth: 15000,
        totalReplies: 300,
        positiveReplies: 15,
        callsBooked: 6,
        newClients: 1.5,
        totalRevenue: 22500,
        netProfit: 20000,
        roi: 800
      }
    },
    {
      name: 'High LTV scenario',
      monthlyRetainer: 2500,
      closeRate: 25,
      ltv: 25000,
      expected: {
        emailsPerMonth: 15000,
        totalReplies: 300,
        positiveReplies: 15,
        callsBooked: 6,
        newClients: 1.5,
        totalRevenue: 37500,
        netProfit: 35000,
        roi: 1400
      }
    },
    {
      name: 'Low close rate scenario',
      monthlyRetainer: 2500,
      closeRate: 10,
      ltv: 15000,
      expected: {
        emailsPerMonth: 15000,
        totalReplies: 300,
        positiveReplies: 15,
        callsBooked: 6,
        newClients: 0.6,
        totalRevenue: 9000,
        netProfit: 6500,
        roi: 260
      }
    },
    {
      name: 'High retainer scenario',
      monthlyRetainer: 5000,
      closeRate: 25,
      ltv: 15000,
      expected: {
        emailsPerMonth: 15000,
        totalReplies: 300,
        positiveReplies: 15,
        callsBooked: 6,
        newClients: 1.5,
        totalRevenue: 22500,
        netProfit: 17500,
        roi: 350
      }
    }
  ];

  // Fixed service metrics
  const emailsPerMonth = 15000;
  const responseRate = 0.02; // 2%
  const positiveReplyRate = 0.05; // 5%
  const callBookingRate = 0.4; // 40%

  // Calculator function
  const calculateROI = (monthlyRetainer: number, closeRate: number, ltv: number) => {
    const totalReplies = emailsPerMonth * responseRate;
    const positiveReplies = totalReplies * positiveReplyRate;
    const callsBooked = positiveReplies * callBookingRate;
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

  testCases.forEach(testCase => {
    it(`should calculate correctly for ${testCase.name}`, () => {
      const result = calculateROI(testCase.monthlyRetainer, testCase.closeRate, testCase.ltv);
      
      expect(result.emailsPerMonth).toBe(testCase.expected.emailsPerMonth);
      expect(result.totalReplies).toBe(testCase.expected.totalReplies);
      expect(result.positiveReplies).toBe(testCase.expected.positiveReplies);
      expect(result.callsBooked).toBe(testCase.expected.callsBooked);
      expect(result.newClients).toBeCloseTo(testCase.expected.newClients, 1);
      expect(result.totalRevenue).toBeCloseTo(testCase.expected.totalRevenue, 0);
      expect(result.netProfit).toBeCloseTo(testCase.expected.netProfit, 0);
      expect(result.roi).toBeCloseTo(testCase.expected.roi, 0);
    });
  });
});

describe('Growth Scenarios Math', () => {
  const baseMetrics = {
    emailsPerMonth: 15000,
    responseRate: 0.02,
    positiveReplyRate: 0.05,
    callBookingRate: 0.4,
    closeRate: 25,
    ltv: 15000,
    monthlyRetainer: 2500
  };

  const getGrowthAdjustedMetrics = (month: number, growthType: string) => {
    let adjustedEmails = baseMetrics.emailsPerMonth;
    let adjustedCloseRate = baseMetrics.closeRate / 100;
    let adjustedNewClients = 0;

    switch (growthType) {
      case 'scaling':
        adjustedEmails = baseMetrics.emailsPerMonth * Math.pow(1.2, month - 1);
        adjustedNewClients = (adjustedEmails * baseMetrics.responseRate * baseMetrics.positiveReplyRate * baseMetrics.callBookingRate) * adjustedCloseRate;
        break;
      case 'improving':
        adjustedCloseRate = Math.min((baseMetrics.closeRate + (month - 1) * 2) / 100, 0.5);
        adjustedNewClients = (baseMetrics.emailsPerMonth * baseMetrics.responseRate * baseMetrics.positiveReplyRate * baseMetrics.callBookingRate) * adjustedCloseRate;
        break;
      case 'linear':
      default:
        adjustedNewClients = (baseMetrics.emailsPerMonth * baseMetrics.responseRate * baseMetrics.positiveReplyRate * baseMetrics.callBookingRate) * adjustedCloseRate;
        break;
    }

    return {
      adjustedEmails,
      adjustedCloseRate,
      adjustedNewClients
    };
  };

  it('should calculate linear growth correctly', () => {
    const month1 = getGrowthAdjustedMetrics(1, 'linear');
    const month6 = getGrowthAdjustedMetrics(6, 'linear');
    
    expect(month1.adjustedNewClients).toBe(1.5);
    expect(month6.adjustedNewClients).toBe(1.5);
    expect(month1.adjustedEmails).toBe(15000);
    expect(month6.adjustedEmails).toBe(15000);
  });

  it('should calculate scaling growth correctly', () => {
    const month1 = getGrowthAdjustedMetrics(1, 'scaling');
    const month2 = getGrowthAdjustedMetrics(2, 'scaling');
    const month3 = getGrowthAdjustedMetrics(3, 'scaling');
    
    expect(month1.adjustedEmails).toBe(15000);
    expect(month2.adjustedEmails).toBe(18000);
    expect(month3.adjustedEmails).toBe(21600);
    
    expect(month1.adjustedNewClients).toBe(1.5);
    expect(month2.adjustedNewClients).toBe(1.8);
    expect(month3.adjustedNewClients).toBe(2.16);
  });

  it('should calculate improving conversions correctly', () => {
    const month1 = getGrowthAdjustedMetrics(1, 'improving');
    const month2 = getGrowthAdjustedMetrics(2, 'improving');
    const month3 = getGrowthAdjustedMetrics(3, 'improving');
    
    expect(month1.adjustedCloseRate).toBe(0.25);
    expect(month2.adjustedCloseRate).toBe(0.27);
    expect(month3.adjustedCloseRate).toBe(0.29);
    
    expect(month1.adjustedNewClients).toBe(1.5);
    expect(month2.adjustedNewClients).toBe(1.62);
    expect(month3.adjustedNewClients).toBeCloseTo(1.74, 1);
  });

  it('should cap improving conversions at 50%', () => {
    const month15 = getGrowthAdjustedMetrics(15, 'improving');
    expect(month15.adjustedCloseRate).toBe(0.5);
  });
});

describe('6-Month Projection Calculations', () => {
  const baseMetrics = {
    emailsPerMonth: 15000,
    responseRate: 0.02,
    positiveReplyRate: 0.05,
    callBookingRate: 0.4,
    closeRate: 25,
    ltv: 15000,
    monthlyRetainer: 2500
  };

  const calculateProjections = (growthType: string) => {
    const projections = [];
    
    for (let month = 1; month <= 6; month++) {
      let adjustedEmails = baseMetrics.emailsPerMonth;
      let adjustedCloseRate = baseMetrics.closeRate / 100;
      
      switch (growthType) {
        case 'scaling':
          adjustedEmails = baseMetrics.emailsPerMonth * Math.pow(1.2, month - 1);
          break;
        case 'improving':
          adjustedCloseRate = Math.min((baseMetrics.closeRate + (month - 1) * 2) / 100, 0.5);
          break;
      }
      
      const adjustedNewClients = (adjustedEmails * baseMetrics.responseRate * baseMetrics.positiveReplyRate * baseMetrics.callBookingRate) * adjustedCloseRate;
      
      // Calculate cumulative values
      let cumulativeClients = 0;
      let cumulativeRevenue = 0;
      
      for (let i = 1; i <= month; i++) {
        let monthEmails = baseMetrics.emailsPerMonth;
        let monthCloseRate = baseMetrics.closeRate / 100;
        
        switch (growthType) {
          case 'scaling':
            monthEmails = baseMetrics.emailsPerMonth * Math.pow(1.2, i - 1);
            break;
          case 'improving':
            monthCloseRate = Math.min((baseMetrics.closeRate + (i - 1) * 2) / 100, 0.5);
            break;
        }
        
        const monthClients = (monthEmails * baseMetrics.responseRate * baseMetrics.positiveReplyRate * baseMetrics.callBookingRate) * monthCloseRate;
        cumulativeClients += monthClients;
        cumulativeRevenue += monthClients * baseMetrics.ltv;
      }
      
      const cumulativeCost = baseMetrics.monthlyRetainer * month;
      const cumulativeProfit = cumulativeRevenue - cumulativeCost;
      const monthlyROI = ((cumulativeRevenue - cumulativeCost) / cumulativeCost) * 100;
      
      projections.push({
        month,
        newClientsThisMonth: adjustedNewClients,
        cumulativeClients,
        cumulativeRevenue,
        cumulativeCost,
        cumulativeProfit,
        monthlyROI
      });
    }
    
    return projections;
  };

  it('should calculate linear projections correctly', () => {
    const projections = calculateProjections('linear');
    
    expect(projections[0].newClientsThisMonth).toBe(1.5);
    expect(projections[0].cumulativeProfit).toBe(20000);
    expect(projections[5].newClientsThisMonth).toBe(1.5);
    expect(projections[5].cumulativeProfit).toBe(120000);
  });

  it('should calculate scaling projections correctly', () => {
    const projections = calculateProjections('scaling');
    
    expect(projections[0].newClientsThisMonth).toBe(1.5);
    expect(projections[1].newClientsThisMonth).toBe(1.8);
    expect(projections[2].newClientsThisMonth).toBe(2.16);
    
    // Month 6 should have significantly more clients
    expect(projections[5].newClientsThisMonth).toBeGreaterThan(3);
  });

  it('should calculate improving projections correctly', () => {
    const projections = calculateProjections('improving');
    
    expect(projections[0].newClientsThisMonth).toBe(1.5);
    expect(projections[1].newClientsThisMonth).toBe(1.62);
    expect(projections[2].newClientsThisMonth).toBeCloseTo(1.74, 1);
    
    // Month 6 should have more clients than month 1
    expect(projections[5].newClientsThisMonth).toBeGreaterThan(projections[0].newClientsThisMonth);
  });
});
