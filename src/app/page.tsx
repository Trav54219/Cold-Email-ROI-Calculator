'use client';

import { useState } from 'react';

export default function Home() {
  const [monthlyRetainer, setMonthlyRetainer] = useState(2500);
  const [closeRate, setCloseRate] = useState(25);
  const [ltv, setLtv] = useState(15000);
  const [emailsPerMonth, setEmailsPerMonth] = useState(15000);
  const [growthType, setGrowthType] = useState('linear'); // 'linear', 'improving'

  // Fixed metrics based on your service
  const responseRate = 0.02; // 2%
  const positiveReplyRate = 0.05; // 5%
  const callBookingRate = 0.40; // 40%

  // Calculations
  const totalReplies = emailsPerMonth * responseRate;
  const positiveReplies = totalReplies * positiveReplyRate;
  const callsBooked = positiveReplies * callBookingRate;
  const newClients = callsBooked * (closeRate / 100);
  const totalRevenue = newClients * ltv;
  const roi = ((totalRevenue - monthlyRetainer) / monthlyRetainer) * 100;
  const netProfit = totalRevenue - monthlyRetainer;

  // Calculate growth-adjusted metrics based on growth type
  const getGrowthAdjustedMetrics = (month: number) => {
    const adjustedEmails = emailsPerMonth;
    let adjustedCloseRate = closeRate / 100;
    let adjustedNewClients = newClients;

    switch (growthType) {
      case 'improving':
        // Improve close rate by 2% each month
        adjustedCloseRate = Math.min((closeRate + (month - 1) * 2) / 100, 0.5); // Cap at 50%
        adjustedNewClients = (emailsPerMonth * responseRate * positiveReplyRate * callBookingRate) * adjustedCloseRate;
        break;
      case 'linear':
      default:
        // Keep everything constant
        break;
    }

    return {
      adjustedEmails,
      adjustedCloseRate,
      adjustedNewClients
    };
  };

  // Month-over-month projections
  const monthlyProjections = Array.from({ length: 6 }, (_, index) => {
    const month = index + 1;
    const { adjustedNewClients } = getGrowthAdjustedMetrics(month);
    
    // Calculate cumulative values
    let cumulativeClients = 0;
    let cumulativeRevenue = 0;
    
    for (let i = 1; i <= month; i++) {
      const { adjustedNewClients: monthClients } = getGrowthAdjustedMetrics(i);
      cumulativeClients += monthClients;
      cumulativeRevenue += monthClients * ltv;
    }
    
    const cumulativeCost = monthlyRetainer * month;
    const cumulativeProfit = cumulativeRevenue - cumulativeCost;
    const monthlyROI = ((cumulativeRevenue - cumulativeCost) / cumulativeCost) * 100;
    
    return {
      month,
      newClientsThisMonth: adjustedNewClients,
      cumulativeClients,
      cumulativeRevenue,
      cumulativeCost,
      cumulativeProfit,
      monthlyROI
    };
  });

  return (
    <div className="min-h-screen bg-background dark">
      {/* Monthly Profit Bar */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-card-foreground">Monthly Profit</span>
            <span className="text-4xl font-bold text-primary">
              ${netProfit.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Main Calculator Card */}
        <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
          {/* Header */}
          <div className="bg-primary px-8 py-6">
            <h1 className="text-3xl font-bold text-primary-foreground mb-2">Cold Email ROI Calculator</h1>
            <p className="text-primary-foreground/80">Calculate your potential return on investment with cold email</p>
          </div>

          <div className="p-8">
            {/* Growth Type Toggle */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-card-foreground mb-4">Growth Scenario</h2>
              <div className="bg-muted rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setGrowthType('linear')}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      growthType === 'linear'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-card-foreground hover:bg-accent/80'
                    }`}
                  >
                    <div className="font-semibold">Linear Growth</div>
                    <div className="text-sm opacity-80">Constant performance each month</div>
                  </button>
                  
                  <button
                    onClick={() => setGrowthType('improving')}
                    className={`p-3 rounded-lg text-center transition-colors ${
                      growthType === 'improving'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-card-foreground hover:bg-accent/80'
                    }`}
                  >
                    <div className="font-semibold">Improving Conversions</div>
                    <div className="text-sm opacity-80">+2% close rate each month</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Input Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-card-foreground mb-6">Your Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Monthly Retainer ($)
                  </label>
                  <input
                    type="number"
                    value={monthlyRetainer || ''}
                    onChange={(e) => setMonthlyRetainer(Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-card-foreground"
                    placeholder="2500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Emails Per Month
                  </label>
                  <input
                    type="number"
                    value={emailsPerMonth || ''}
                    onChange={(e) => setEmailsPerMonth(Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-card-foreground"
                    placeholder="15000"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Number of cold emails sent per month</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Close Rate (%)
                  </label>
                  <input
                    type="number"
                    value={closeRate || ''}
                    onChange={(e) => setCloseRate(Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-card-foreground"
                    placeholder="25"
                  />
                  <p className="text-xs text-muted-foreground mt-1">What percentage of your sales calls convert to clients?</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Customer Lifetime Value ($)
                  </label>
                  <input
                    type="number"
                    value={ltv || ''}
                    onChange={(e) => setLtv(Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-card-foreground"
                    placeholder="10000"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Average revenue generated per client over their lifetime</p>
                </div>
              </div>
            </div>

            {/* ROI Breakdown */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-card-foreground mb-6">Your ROI Breakdown</h2>
              
              {/* Monthly Conversion Funnel */}
              <div className="bg-muted rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Monthly Conversion Funnel</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white font-medium">Emails Sent</span>
                    <span className="font-bold text-white text-lg">{emailsPerMonth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white font-medium">Replies (2%)</span>
                    <span className="font-bold text-white text-lg">{Math.round(totalReplies)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white font-medium">Leads (5% of replies)</span>
                    <span className="font-bold text-white text-lg">{Math.round(positiveReplies)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white font-medium">Booked Calls (40% of leads)</span>
                    <span className="font-bold text-white text-lg">{Math.round(callsBooked)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-border pt-3">
                    <span className="text-white font-semibold">New Clients ({closeRate}% close rate)</span>
                    <span className="font-bold text-primary text-xl">{newClients.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Financial Impact */}
              <div className="bg-accent rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Financial Impact</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white font-medium">Monthly Revenue</span>
                    <span className="font-bold text-chart-2 text-lg">${totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white font-medium">Monthly Investment</span>
                    <span className="font-bold text-destructive">-${monthlyRetainer.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-border pt-3">
                    <span className="text-white font-semibold">Monthly Profit</span>
                    <span className="font-bold text-chart-2 text-xl">${netProfit.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* ROI Display */}
              <div className="bg-primary rounded-xl p-8 text-center">
                <h3 className="text-primary-foreground text-lg font-semibold mb-2">Your ROI</h3>
                <div className="text-6xl font-bold text-primary-foreground mb-2">{roi.toFixed(0)}%</div>
                <p className="text-primary-foreground font-medium text-lg">For every $1 invested, you get ${(roi / 100).toFixed(2)} back</p>
              </div>
            </div>
          </div>
        </div>

        {/* 6-Month Cash Flow Projection */}
        <div className="mt-8 bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
          <div className="bg-primary px-8 py-6">
            <h2 className="text-2xl font-bold text-primary-foreground">6-Month Cash Flow Projection</h2>
            <p className="text-primary-foreground/80 mt-1">
              {growthType === 'linear' && 'Linear Growth - Constant performance each month'}
              {growthType === 'improving' && 'Improving Conversions - Close rate improves by 2% monthly'}
            </p>
          </div>
          
          <div className="p-8">
            <div className="space-y-0">
              {monthlyProjections.map((projection) => (
                <div key={projection.month} className="flex items-center justify-between p-4 bg-muted hover:bg-accent transition-colors border-b-2 border-border last:border-b-0 first:rounded-t-xl last:rounded-b-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                      {projection.month}
                    </div>
                    <div>
                      <div className="font-semibold text-white">Month {projection.month}</div>
                      <div className="text-sm text-muted-foreground">
                        {projection.newClientsThisMonth.toFixed(1)} new clients
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      projection.cumulativeProfit >= 0 
                        ? 'text-primary' 
                        : 'text-destructive'
                    }`}>
                      ${projection.cumulativeProfit.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {projection.monthlyROI.toFixed(0)}% ROI
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 6-Month Total */}
            <div className="mt-6 p-6 bg-accent rounded-xl border-2 border-border">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-semibold text-white">6-Month Total</div>
                  <div className="text-base text-white font-medium">
                    ${monthlyRetainer * 6} invested
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary">
                    ${monthlyProjections[5].cumulativeProfit.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Profit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
