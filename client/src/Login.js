import Field from './Field';
import { Link, useNavigate } from 'react-router-dom';
import { useState/*, useRef, useEffect*/ } from 'react';
import io from 'socket.io-client';

function Login(props) {
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
            const res = await fetch("http://localhost:5000/api/Tokens", {
            "method": "post",
            "headers": {
                "Content-Type": "application/json",
            },
            "body": JSON.stringify(data)
            });
            if (res.status === 200) {
                localStorage.setItem("token", await res.text());
                localStorage.setItem("username", newUser["username"]);
                const res2 = await fetch("http://localhost:5000/api/Favorites", {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    'authorization': "Bearer " + localStorage.getItem("token")
                    }
                });
                if (res2.status === 200) {
                    const data = await res2.json();
                    props.setFavoritesStockList(data.stocks);
                    let soc = props.socket;
                    if (props.socket == null) {
                        soc = io("http://127.0.0.1:5000", {});
                        props.setSocket(soc);
                    }
                    soc.emit('username', newUser["username"], () => {});
                    nav("/home");
                }
            } else {
                alert("wrong username or password!");
            }
        }

    const loginClick = () => {
        if (!fields.hasOwnProperty("username")) {
            alert("missing username");
            return;
        }
        if (!fields.hasOwnProperty("password")) {
            alert("missing password");
            return;
        }
        sendDetails(fields);
      }

  return (
    <div className="card">
        <h2 class="card-title">Log-in</h2>
        <Field type="username" name="username" onChange={handleChange}/>
        <br/>
        <Field type="password" name="password" onChange={handleChange}/>
        <br/>
        <button type="button" className="btn btn-primary" onClick={loginClick}>log in</button>
        <span>
            don't have an account?{' '}
            <Link to="/register">register</Link>
        </span>
    </div>
  );
}

export default Login;