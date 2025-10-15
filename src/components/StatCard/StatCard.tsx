import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";

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
  <div className="card bg-base-100 card-border border-base-300">
    <div className="stats relative">
      <div className="stat">
        <div className="stat-title text-bold">{title}</div>
        <div className="stat-value">{value}</div>
        <div className={`rounded-full absolute top-4 right-4 p-2 ${iconBg}`}>
          {icon}
        </div>
        <div className="stat-desc flex items-center gap-2">
          <span
            className={`flex items-center mr-2 ${
              changeType === "increase" ? "text-success" : "text-error"
            }`}
          >
            {changeType === "increase" ? (
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
  </div>
);
