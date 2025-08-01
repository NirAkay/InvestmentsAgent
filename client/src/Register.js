import Field from './Field';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css'
import { useState } from 'react';

function Register() {
    const [fields, setFields] = useState({});
    const nav = useNavigate();
    
        const handleChange = (e) => {
            const { name, value } = e.target;
            fields[name] = value;
            setFields(fields);
          };
        
        async function sendDetails(newUser) {
            const data = {
            "username": newUser["username"],
            "password": newUser["password"],
            }
            const res = await fetch("http://localhost:5000/api/Users", {
            "method": "post",
            "headers": {
                "Content-Type": "application/json",
            },
            "body": JSON.stringify(data)
            })

            if (res.status === 200) {
                nav("/");
            } else {
                alert("user already exsist!");
            }
        }

        function checkValidText(str) {
            for (let i = 0; i < str.length; i++) {
                if (str[i] >= 'a' && str[i] <= 'z') {
                    continue;
                }
                if (str[i] >= 'A' && str[i] <= 'Z') {
                    continue;
                }
                if (str[i] >= '0' && str[i] <= '9') {
                    continue;
                }
                return false;
            }
            return true;
        }
        
        const registerClick = () => {
            if (!fields.hasOwnProperty("username") || fields["username"] === "") {
                alert("missing username");
                return;
            }
            if (!fields.hasOwnProperty("password") || fields["password"] === "") {
                alert("missing password");
                return;
            }
            if (!fields.hasOwnProperty("confirmPassword") || fields["confirmPassword"] === "") {
                alert("missing confirm password");
                return;
            }
            if (fields["password"].length < 8) {
                alert("password to short!");
                return;
            }
            if (!checkValidText(fields["username"])) {
                alert("username is not valid!\nplease enter only numbers and latin charecters");
                return;
            }
            if (!checkValidText(fields["password"])) {
                alert("password is not valid!\nplease enter only numbers and latin charecters");
                return;
            }
            if (fields["password"] !== fields["confirmPassword"]) {
                alert("please confirm password correctly!");
                return;
            }
            sendDetails(fields)
          }

  return (
    <div className="card">
        <span className = "link_login">
            <Link to="/">Login</Link>
        </span>
        <h2 class="card-title">Register</h2>
        <Field type="username" name="username" onChange={handleChange}/>
        <br/>
        <Field type="password" name="password" onChange={handleChange}/>
        <br/>
        <Field type="confirm password" name="confirmPassword" onChange={handleChange}/>
        <br/>
        <button type="button" class="btn btn-primary" onClick={registerClick}>Register</button>
    </div>
  );
}

export default Register;