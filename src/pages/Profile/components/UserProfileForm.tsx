import { useForm } from "react-hook-form";
import userStore from "@/zustand/userStore";
import { Avartar, Button } from "@/components";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import style from "@/pages/Profile/profile.module.css";
import { imageUpload } from "@/utils/imageUpload";
import { checkNickName, updateUserInfo } from "@/apis/profile.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/consts/zodSchema";
import AddressForm from "@/pages/Profile/components/AddressForm";
import useToast from "../../../components/UI/Toast/hooks/useToast";
import { AddressType } from "@/types/user.type";

const UserProfileForm = () => {
  const { user, setUser } = userStore();
  const { toast } = useToast();

  const {
    handleSubmit,
    getValues,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nickName: user?.nickname || "",
    },
    resolver: zodResolver(userSchema),
    mode: "onBlur",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImg, setPreviewImg] = useState<string>(
    user?.profileImage || "/images/profile.png"
  );
  const [file, setFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);
  const [isNickNameConfirm, setIsNickNameConfirm] = useState<boolean>(false);
  const [confirmedNickName, setConfirmedNickName] = useState<string | null>(
    user?.nickname || ""
  );
  const [selectedAddress, setSelectedAddress] = useState<AddressType>({
    jibun_address: user?.jibun_address ?? "",
    lat: user?.location_coordinates_lat ?? 0,
    lng: user?.location_coordinates_lng ?? 0,
  });

  useEffect(() => {
    if (user?.profileImage) {
      setPreviewImg(user.profileImage);
    }
  }, [user?.profileImage]);

  const handleClickFile = () => {
    fileInputRef?.current?.click();
  };

  const handleChangeImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreviewImg(previewUrl);
    }
  };

  // const handleChangeNickName = (e: ChangeEvent<HTMLInputElement>) => {
  //   setValue("nickName", e.target.value);
  //   setIsNickNameConfirm(false);
  // };

  // 회원정보 수정
  const onSubmitUser = async () => {
    const nickName = getValues("nickName");
    let imageUrl = user?.profileImage;

    if (file) {
      imageUrl = await imageUpload(file);
      if (imageUrl) {
        setUser({ profileImage: imageUrl });
      }
    }

    const isNickNameChanged = nickName !== user?.nickname;

    if (
      isNickNameChanged &&
      (!isNickNameConfirm || nickName !== confirmedNickName)
    ) {
      toast({ type: "ERROR", description: "닉네임 중복 확인을 해주세요." });
      return;
    }

    if (
      nickName === user?.nickname &&
      imageUrl === user.profileImage &&
      JSON.stringify(selectedAddress) === JSON.stringify(user.jibun_address)
    ) {
      setUpdating(false);
      return;
    }

    const success = await updateUserInfo(
      user?.email ?? "",
      nickName,
      imageUrl ?? "",
      selectedAddress
    );

    if (success) {
      setUser({
        nickname: nickName,
        profileImage: imageUrl,
        jibun_address: selectedAddress.jibun_address,
        location_coordinates_lat: selectedAddress.lat,
        location_coordinates_lng: selectedAddress.lng,
      });

      toast({ type: "SUCCESS", description: "회원정보 수정 완료" });
      setUpdating(false);
    } else {
      toast({ type: "ERROR", description: "회원정보 수정에 실패했습니다." });
    }
  };

  // 닉네임 중복 확인
  const nickNameConfirm = async () => {
    const nickName = getValues("nickName");
    if (nickName.length > 10) {
      setIsNickNameConfirm(false);
      setConfirmedNickName(null);
      toast({
        type: "ERROR",
        description: "닉네임은 10글자 이하로 입력해주세요.",
      });
      return;
    }

    if (nickName === user?.nickname) {
      setIsNickNameConfirm(true);
      setConfirmedNickName(nickName);
    }

    if (nickName === user?.nickname) {
      setIsNickNameConfirm(true);
      toast({ type: "SUCCESS", description: "사용가능한 닉네임 입니다." });
      return;
    }

    const isAvailable = await checkNickName(nickName);
    if (isAvailable) {
      setIsNickNameConfirm(true);
      setConfirmedNickName(nickName);
      toast({ type: "SUCCESS", description: "사용가능한 닉네임 입니다." });
    } else {
      setIsNickNameConfirm(false);
      setConfirmedNickName(null);
      toast({ type: "ERROR", description: "이미 사용 중인 닉네임입니다." });
    }
  };

  const handlePrevProfile = () => {
    setUpdating(false);
    setPreviewImg(user?.profileImage || "");
    setSelectedAddress({
      jibun_address: user?.jibun_address ?? "",
      lat: user?.location_coordinates_lat ?? 0,
      lng: user?.location_coordinates_lng ?? 0,
    });
    reset({
      nickName: user?.nickname || "",
    });
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleSelectAddress = (address: AddressType) => {
    setSelectedAddress(address);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitUser)} className={style.form}>
      {updating ? (
        <ul className={style.userUl}>
          <img
            onClick={handlePrevProfile}
            src={"/images/prev.png"}
            className={style.prev}
            alt="뒤로가기"
          />
          <li className={style.img_wrap}>
            <Avartar
              onClick={handleClickFile}
              image={previewImg}
              className={style.img}
              alt="프로필 이미지 선택"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleChangeImg}
              className={style.file}
            />
          </li>
          <li className={style.nickname_wrap}>
            <label>닉네임</label>
            <div className={style.nickName_div}>
              <input
                {...register("nickName")}
                className={style.input}
                placeholder="닉네임은 1글자 이상, 10글자 이하"
              />
              <Button
                type="button"
                onClick={nickNameConfirm}
                className={style.button}
              >
                중복확인
              </Button>
            </div>
            {errors.nickName && (
              <p className={style.error}>{errors.nickName.message}</p>
            )}
          </li>
          <li className={style.nickname_wrap}>
            <label>주소</label>
            <div className={style.nickName_div}>
              <input
                value={selectedAddress.jibun_address}
                className={style.input}
                onClick={handleOpenModal}
                readOnly
              />
              <AddressForm
                closeModal={handleCloseModal}
                openModal={handleOpenModal}
                isOpen={isOpen}
                onSelectAddress={handleSelectAddress}
              />
            </div>
          </li>
          <Button type="submit" className={style.button}>
            회원정보 수정
          </Button>
        </ul>
      ) : (
        <ul className={style.userUl}>
          <div className={style.userUl_div}>
            <Avartar image={user?.profileImage} className={style.basic_img} />
            <div className={style.userName_box}>
              <p>{user?.nickname}</p>
              <img
                onClick={() => setUpdating(true)}
                src={"/images/pencil.png"}
                className={style.pencil}
                alt="프로필 수정"
              />
            </div>
            <p className={style.address}>{selectedAddress.jibun_address}</p>
          </div>
        </ul>
      )}
    </form>
  );
};

export default UserProfileForm;
