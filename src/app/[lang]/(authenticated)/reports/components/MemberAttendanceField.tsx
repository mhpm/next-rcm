import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Option = { value: string; label: string };

interface MemberAttendanceFieldProps {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  members: Option[];
  label?: string;
  className?: string;
}

export function MemberAttendanceField({
  id,
  value = [],
  onChange,
  members = [],
  label,
  className,
}: MemberAttendanceFieldProps) {
  const handleToggle = (memberId: string, checked: boolean) => {
    // Avoid re-triggering if state is already consistent
    if (value.includes(memberId) === checked) return;

    if (checked) {
      onChange([...value, memberId]);
    } else {
      onChange(value.filter((id) => id !== memberId));
    }
  };

  const attendanceCount = value.length;
  const absentCount = members.length - attendanceCount;
  const absentMembers = members.filter((m) => !value.includes(m.value));

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Label className="font-medium text-base">{label}</Label>
        <div className="flex gap-2">
          <Badge variant="default" className="whitespace-nowrap">
            Asistieron: {attendanceCount}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help" tabIndex={0}>
                  <Badge
                    variant="secondary"
                    className="hover:bg-secondary/80 whitespace-nowrap"
                  >
                    Faltaron: {absentCount}
                  </Badge>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {absentMembers.length > 0 ? (
                  <div className="space-y-1">
                    <p className="font-semibold text-xs mb-1">Faltaron:</p>
                    <ul className="text-xs list-disc pl-3 space-y-0.5 max-h-[200px] overflow-y-auto">
                      {absentMembers.map((m) => (
                        <li key={m.value}>{m.label}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <span className="text-xs">¡Todos asistieron! 🎉</span>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
        {members.map((member) => {
          const isChecked = value.includes(member.value);
          return (
            <div
              key={member.value}
              className={cn(
                'flex items-center space-x-3 border p-3 rounded-lg transition-colors cursor-pointer hover:bg-muted/50',
                isChecked ? 'bg-primary/5 border-primary/30' : 'bg-card'
              )}
              onClick={(e) => {
                e.preventDefault();
                handleToggle(member.value, !isChecked);
              }}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleToggle(member.value, checked as boolean)
                  }
                  id={`${id}-${member.value}`}
                />
              </div>
              <label
                htmlFor={`${id}-${member.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                {member.label}
              </label>
            </div>
          );
        })}
        {members.length === 0 && (
          <div className="col-span-full py-8 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
            No hay miembros registrados en esta célula.
          </div>
        )}
      </div>
    </div>
  );
}
