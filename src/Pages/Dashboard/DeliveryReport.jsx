import React from 'react';
import { PieChart, Pie, Cell, Rectangle } from 'recharts';

const DeliveryReport = ({ courierCounts }) => {
  // Function to create the needle effect (if you have that implemented)
  const needle = (value, cx, cy, innerRadius, outerRadius, color) => {
    // Implement your needle logic here
    return null; // Placeholder
  };

  // Sample values for cx, cy, innerRadius, outerRadius (adjust as necessary)
  const cx = 125; // Center X position
  const cy = 125; // Center Y position
  const iR = 40;  // Inner radius
  const oR = 100; // Outer radius

  return (
    <div className="col-span-12 lg:col-span-6 custom-shadow rounded-lg overflow-x-auto flex flex-nowrap ">
      <div><h2 className="text-xl font-bold mb-4">Delivery Report</h2></div>
      
      {/* Map over courierCounts to create a chart for each courier */}
      {courierCounts.map((courier, index) => (
        <div key={index} className="w-[250px] flex-shrink-0 flex flex-col items-center pt-0 mt-0 justify-center">
          <div className="flex items-center justify-between w-[70%] mt-2">
            <img src={`/assets/${courier.courier}.png`} alt={courier.courier} className="w-6 h-6" />
            <span className="font-bold">{courier.courier}</span>
            <span className="font-medium">{courier.total}</span>
          </div>
          <PieChart width={250} height={250}>
            <Rectangle x={0} y={0} width={400} height={500} fill="#f0f0f0" />
            <Pie
              dataKey="percentage"
              startAngle={180}
              endAngle={0}
              data={[{ value: courier.percentage }, { value: 100 - courier.percentage }]}
              cx={cx}
              cy={cy}
              innerRadius={iR}
              outerRadius={oR * 0.7}
              fill="#8884d8"
              stroke="none"
            >
              {[{ value: courier.percentage }, { value: 100 - courier.percentage }].map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#EB5757' : '#8884d8'} />
              ))}
            </Pie>
            {needle(courier.percentage, cx, cy, iR, oR, "#EB5757")}
            <text
              x={cx - 55}
              y={cy + 30}
              textAnchor="middle"
              fontSize={16}
              fill="#000"
            >
              0%
            </text>
            <text
              x={cx + 70}
              y={cy + 30}
              textAnchor="middle"
              fontSize={16}
              fill="#000"
            >
              100%
            </text>
            <text
              x={cx}
              y={cy + 35}
              textAnchor="middle"
              fontSize={20}
              fill="#000"
            >
              {courier.percentage.toFixed(2)}%
            </text>
          </PieChart>
        </div>
      ))}
    </div>
  );
};

export default DeliveryReport;
