import { Auth } from "aws-amplify";

const CheckAuth = async () => {
    const user = await Auth.currentAuthenticatedUser()
    .then((userData) => {
        console.log("user is authenticated")
    })
    .catch(() => {
        router.push('.')
    })
};

export default CheckAuth;