import clsx from "clsx";
import React from "react";
import { Button } from "@medusajs/ui";

export type ActionType = {
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "normal" | "danger";
  disabled?: boolean;
  icon?: React.ReactNode;
  component?: React.ReactNode;
};

type ActionablesProps = {
  actions?: ActionType[];
  customTrigger?: React.ReactNode;
  forceDropdown?: boolean;
};

const Actionables: React.FC<ActionablesProps> = ({
  actions,
  customTrigger,
  forceDropdown = false,
}) => {
  if (actions && (forceDropdown || actions.length > 1)) {
    return (
      <>
        <div>
          {actions.map((action, i) => {
            return action.component;
          })}
        </div>
        <div>
          {actions.map((action, i) => {
            if (!action.component) {
              return (
                <Button
                  variant="secondary"
                  size="base"
                  className={clsx("flex w-full justify-start", {
                    "text-rose-50": action?.variant === "danger",
                    "pointer-events-none select-none opacity-50":
                      action?.disabled,
                  })}
                  onClick={action?.onClick}
                >
                  {action.icon}
                  {action.label}
                </Button>
              );
            }
          })}
        </div>
      </>
    );
  }

  if (customTrigger) {
    const triggers = Array.isArray(customTrigger)
      ? customTrigger
      : [customTrigger];
    return (
      <div>
        {triggers.map((trigger, i) => (
          <div key={i}>{trigger}</div>
        ))}
      </div>
    );
  }

  const [action] = actions ?? [];
  if (action) {
    return (
      <div>
        <Button
          variant="secondary"
          size="base"
          type="button"
          className="flex items-center"
          onClick={action.onClick}
        >
          {action.icon ? (
            <div className="gap-x-2xsmall flex items-center">
              {action.icon}
              {action.label}
            </div>
          ) : (
            <>{action.label}</>
          )}
        </Button>
      </div>
    );
  }

  return null;
};

export default Actionables;
