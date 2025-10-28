import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

export const StatCard = ({
  icon,
  title,
  value,
  change,
  changeType,
  period,
  iconBg = "bg-base-300",
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  period: string;
  iconBg?: string;
}) => (
  <div className="card bg-base-100 card-border shadow-md">
    <div className="stats relative">
      <div className="stat">
        <div className="stat-title text-bold font-extrabold text-lg text-secondary">
          {title}
        </div>
        <div className="stat-value">{value}</div>
        <div className={`rounded-full absolute top-4 right-4 p-2 ${iconBg}`}>
          {icon}
        </div>
        <div className="stat-desc flex items-center gap-2 text-md">
          <span
            className={`flex items-center ${
              changeType === "increase" ? "text-success" : "text-error"
            }`}
          >
            {changeType === "increase" ? (
              <FaArrowTrendUp />
            ) : (
              <FaArrowTrendDown />
            )}
            <span className="ml-1">{change}</span>
          </span>
          <span className="text-base-content/60">{period}</span>
        </div>
      </div>
    </div>
  </div>
);
