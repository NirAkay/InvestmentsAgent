import './Field.css';

function Field(props) {
  return (
    <div>
      <p className="field_title">{props.type}</p>
      <input name={props.name} type = {props.type === "password" || props.type === "confirm password" ? "password" : "text"} class="form-control" placeholder={props.type} aria-label={props.type} aria-describedby="basic-addon1" value={props.value} onChange={props.onChange}/>
    </div>
  );
}

export default Field;
