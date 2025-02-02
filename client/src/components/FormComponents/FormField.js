import Label from "./Label";
import Input from "./Input";

const FormField = ({ id, label, type = "text", ...props}) => (
  <div className={`${id}`}>
    <div className="col">
      <Label htmlFor={id} className="label">
        {label}
      </Label>
      {type === "textarea" ? (
        <textarea id={id} className="input" {...props}></textarea>
      ) : (
        <Input type={type} id={id} className="input" {...props} />
      )}
    </div>
  </div>
);
export default FormField;