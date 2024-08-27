const _ = require("lodash");
const { Profile } = require("../models/profile");

module.exports.getProfile = async (req, res) => {
  const userId = req.user._id;
  const profile = await Profile.findOne({ user: userId });
  if (profile) return res.status(200).send(profile);
  return res.status(400).send("Some thing is wrong!");
};
module.exports.setProfile = async (req, res) => {
  const userId = req.user._id;
  const userProfile = _.pick(req.body, [
    "phone",
    "address1",
    "address2",
    "country",
    "postCode",
    "city",
    "State",
  ]);
  userProfile["user"] = userId;
  let profile = Profile.findOne({ user: userId });
  if (profile) {
    await Profile.updateOne({ user: userId }, userProfile);
    return res.status(200).send("Profile updated Successfully.");
  } else {
    profile = await new Profile(userProfile);
    const updatedProfile = await profile.save();
    return res.status(201).send(updatedProfile);
  }
};
