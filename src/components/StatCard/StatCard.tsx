import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';

export const StatCard = ({
  icon,
  title,
  value,
  change,
  changeType,
  period,
  iconBg,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  period: string;
  iconBg: string;
}) => (
  <div className="card shadow-xl bg-base-100 rounded-xl">
    <div className="card-body">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-base-content/60">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`rounded-full p-2 ${iconBg}`}>{icon}</div>
      </div>
      <div className="flex items-center mt-2 text-sm">
        <span
          className={`flex items-center mr-2 ${
            changeType === 'increase' ? 'text-success' : 'text-error'
          }`}
        >
          {changeType === 'increase' ? (
            <RiArrowUpSLine />
          ) : (
            <RiArrowDownSLine />
          )}
          {change}
        </span>
        <span className="text-base-content/60">{period}</span>
      </div>
    </div>
  </div>
);
