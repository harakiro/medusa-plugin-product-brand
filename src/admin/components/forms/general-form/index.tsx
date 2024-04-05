import { Input, Label, Tooltip } from "@medusajs/ui";
import { NestedForm } from "../../../utils/nested-form";
import FormValidator from "../../../utils/form-validator";
import { InformationCircleSolid } from "@medusajs/icons";

export type GeneralFormType = {
  title: string;
  handle: string;
};

type Props = {
  form: NestedForm<GeneralFormType>;
  requireHandle?: boolean;
};

const GeneralForm = ({ form }: Props) => {
  const {
    register,
    path,
    control,
    formState: { errors },
  } = form;

  return (
    <>
      <div className="flex flex-col items-center w-full gap-y-8 mb-4">
        <div className="flex w-full gap-x-8">
          <div className="flex flex-col flex-1 gap-y-2">
            <Label htmlFor="title" className="text-ui-fg-subtle">
              Title <span className="text-red-600">*</span>
            </Label>
            <Input
              required
              id="title"
              placeholder="Brand Title"
              {...register(path("title"), {
                required: "Title is required",
                minLength: {
                  value: 1,
                  message: "Title must be at least 1 character",
                },
                pattern: FormValidator.whiteSpaceRule("Title"),
              })}
            />
          </div>
        </div>
        <div className="flex w-full gap-x-8">
          <div className="flex flex-col flex-1 gap-y-2">
            <div className="flex items-center gap-x-2">
              <Label htmlFor="handle" className="text-ui-fg-subtle">
                Handle
              </Label>
              <Tooltip content="The handle is the part of the URL that identifies the product. If not specified, it will be generated from the title.">
                <InformationCircleSolid />
              </Tooltip>
            </div>

            <Input
              id="handle"
              placeholder="/nike"
              {...register(path("handle"))}
              prefix="/"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralForm;
