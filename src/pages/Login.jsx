import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, sendEmailVerification } from "firebase/auth";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState("");
  const [caricamento, setCaricamento] = useState(false);
  
  const { login } = useAuth();
  const naviga = useNavigate();

  /* in questo modo è react a gestire l'invio dei dati tramite il tasto entra*/
  const gestisciLogin = async (e) => {
    e.preventDefault();

    try {
      setErrore("");
      setCaricamento(true);
      
      const credenziali = await login(email, password);
      
      if (!credenziali.user.emailVerified) {          /* non mi piaceva l'idea che si potesse entrare con qualsiasi email inventata quindi ho voluto mettere la verifica tramite email*/
        await sendEmailVerification(credenziali.user);
        await signOut(auth);
        
        setErrore("Account non verificato. Ti abbiamo inviato un nuovo link via email. Controlla anche lo spam.");
        setCaricamento(false);
        return;
      }

      naviga("/");
    } catch (err) {        /* in caso di email o password errata */
      console.error("Problema col login:", err);
      setErrore("Email o password errati.");
    } finally {
      setCaricamento(false); 
    }
  };

  return (
    <div className="container-login">
      <h2>Accedi a WolfX</h2>
      
      {errore && <p className="login-error">{errore}</p>}
      
      <form onSubmit={gestisciLogin} className="login-form">
        <input 
          type="email" 
          required 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email" 
        />
        <input 
          type="password" 
          required 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password" 
        />
        
        <button disabled={caricamento} type="submit" className="login-button">
          {caricamento ? "Accesso..." : "Entra"}
        </button>
      </form>
      
      <div className="login-footer">
        Non hai un account? <Link to="/signup">Registrati</Link>
      </div>
    </div>
  );
};

export default Login;