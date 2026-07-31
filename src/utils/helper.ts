import { UserDocument } from "#/models/users";

export const generateToken = (length: number=6): string => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};
// helper to send profile to authentacited user 
export const formatProfile = (user:UserDocument)=>{
  return {
      id: user.id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.following.length,
    };
}