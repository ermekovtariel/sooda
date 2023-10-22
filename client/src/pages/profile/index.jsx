import { useSelector } from 'react-redux';

const Profile=()=> {
  const {user} = useSelector( store=> store.auth )  
  console.log(user);
  return (
    <div>Profile</div>
  )
}

export default Profile