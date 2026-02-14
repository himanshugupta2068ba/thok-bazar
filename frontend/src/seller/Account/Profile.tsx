import { Edit } from "@mui/icons-material";
import { Avatar, Button, Divider } from "@mui/material";
import { ProfileFieldCart } from "../../customer/pages/account/ProfileFieldCart";

export const Profile = () => {
  return (
    <div className="Lg:px-20 pt-5 pb-20 space-y-20 flex justify-center">
      <div className="w-full lg:w-[70%]">
        <div className="flex items-center pb-3 justify-between">
          <h1 className="font-bold text-2xl">Personal Details</h1>
          <div>
            <Button className="w-16 h-16">
              <Edit />
            </Button>
          </div>
        </div>
        <div>
          <Avatar
            sx={{ width: "10rem", height: "10rem" }}
            src="https://avatars.githubusercontent.com/u/196467988?v=4"
          />
          <div>
            <ProfileFieldCart keys={"Seller Name"} value={"Himan Shah"} />
            <Divider className="my-2" />
            <ProfileFieldCart keys={"Email"} value={"uhejnekj@gmail.com"} />
            <Divider className="my-2" />
            <ProfileFieldCart keys={"Phone"} value={"+91 1234567890"} />

          </div>
        </div>
        <Divider className="my-10" />
        <div className="flex items-center pb-3 justify-between py-10">
          <h1 className="font-bold text-2xl">Business Details</h1>
          <div>
            <Button className="w-16 h-16">
              <Edit />
            </Button>
          </div>
        </div>
        <div>
          <div>
            <ProfileFieldCart keys={"Business Name"} value={"Thok Bazar Store"} />
            <Divider className="my-2" />
            <ProfileFieldCart keys={"GST Number"} value={"18AAJCU5055R1Z0"} />
            <Divider className="my-2" />
            <ProfileFieldCart keys={"PAN Number"} value={"AAMPH1234A"} />
            <Divider className="my-2" />
            <ProfileFieldCart keys={"Business Address"} value={"123 Market Street, New Delhi, 110001"} />
            <Divider className="my-2" />
            <ProfileFieldCart keys={"Business Category"} value={"Electronics & General Merchandise"} />
            <Divider className="my-2" />
            <ProfileFieldCart keys={"Bank Account"} value={"XXXX XXXX XXXX 5678"} />
          </div>
        </div>
      </div>
    </div>
  );
};
