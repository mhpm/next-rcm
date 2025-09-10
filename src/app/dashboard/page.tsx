import {
  RiMoneyDollarCircleLine,
  RiArchiveLine,
  RiGroupLine,
  RiPriceTag3Line,
  RiArrowUpSLine,
  RiArrowDownSLine,
} from 'react-icons/ri';

const StatCard = ({
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
  <div className="card bg-base-200 shadow-xl">
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

export default function Dashboard() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Business Overview</h1>
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <a>Nexus</a>
            </li>
            <li>
              <a>Dashboards</a>
            </li>
            <li>Ecommerce</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenue"
          value="$587.54"
          change="10.8%"
          changeType="increase"
          period="vs. $494.16 last period"
          icon={<RiMoneyDollarCircleLine size={24} className="text-success" />}
          iconBg="bg-success/20"
        />
        <StatCard
          title="Sales"
          value="4500"
          change="21.2%"
          changeType="increase"
          period="vs. 3845 last period"
          icon={<RiArchiveLine size={24} className="text-info" />}
          iconBg="bg-info/20"
        />
        <StatCard
          title="Customers"
          value="2242"
          change="6.8%"
          changeType="decrease"
          period="vs. 2448 last period"
          icon={<RiGroupLine size={24} className="text-error" />}
          iconBg="bg-error/20"
        />
        <StatCard
          title="Spending"
          value="$112.54"
          change="8.5%"
          changeType="increase"
          period="vs. $98.14 last period"
          icon={<RiPriceTag3Line size={24} className="text-warning" />}
          iconBg="bg-warning/20"
        />
      </div>
    </div>
  );
}
