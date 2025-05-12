
import "./SocialButton.css"

const SocialButton = ({ icon, provider, onClick }) => {
  return (
    <button className="social-button" onClick={onClick}>
      {icon}
      <span>{provider}</span>
    </button>
  )
}

export default SocialButton

