import { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import userAuthStore from "@/zustand/userStore";
import style from "./createPetProfile.module.css";
import { Button } from "@/components";
import { useNavigate } from "react-router-dom";
import { imageUpload } from "@/utils/imageUpload";
// import dog from "/images/dog.png";
import { Pet } from "@/types/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { petSchema } from "@/consts/zodSchema";
import { z } from "zod";
import { createPet } from "@/apis/profile.api";
import useToast from "@/components/UI/Toast/hooks/useToast";

const petDefaultValues = {
  name: "",
  age: "",
  breed: "",
};

type PetSchema = z.infer<typeof petSchema>;
const CreatePetProfile = () => {
  const { userId, setUserPet, userPet } = userAuthStore();
  const navigate = useNavigate();
  const [previewImg, setPreviewImg] = useState<string>("/images/dog.png");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PetSchema>({
    defaultValues: petDefaultValues,
    resolver: zodResolver(petSchema),
    mode: "onBlur",
  });

  const { toast } = useToast();

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

  const onSubmit = async (petData: Pet) => {
    let imageUrl = "";

    if (!file) {
      toast({
        type: "ERROR",
        description: "이미지를 선택해주세요.",
      });
      return;
    }

    imageUrl = await imageUpload(file);

    try {
      const response = await createPet(userId!, petData, imageUrl);

      if (response) {
        toast({
          type: "SUCCESS",
          description: "반려동물 프로필이 저장되었습니다.",
        });

        navigate("/profile");

        const newPet = {
          _id: response.id,
          name: response.name,
          age: response.age,
          breed: response.breed,
          image: response.image,
        };
        setUserPet([...(userPet || []), newPet]);
      }
    } catch (error) {
      console.error("반려동물 정보 저장 실패", error);
    }
  };

  return (
    <div className={style.petProfile_wrap}>
      <div className={style.petProfile_wrap_div}>
        <p>반려동물 프로필 만들기🐾</p>
      </div>
      <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
        <ul className={style.pet_wrap}>
          <li className={style.img_wrap}>
            <img
              onClick={handleClickFile}
              src={previewImg}
              className={style.img}
              alt="반려동물 이미지 선택"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleChangeImg}
              className={style.file}
            />
            <p>이미지 선택은 필수입니다.</p>
          </li>
          <div className={style.list_box}>
            <li className={style.list}>
              <div>
                <label>이름:</label>
                <input type="text" {...register("name", { required: true })} />
              </div>
              <div>
                {errors.name && (
                  <p className={style.error}>{errors.name.message}</p>
                )}
              </div>
            </li>
            <li className={style.list}>
              <div>
                <label>나이:</label>
                <input type="text" {...register("age", { required: true })} />
              </div>
              <div>
                {errors.age && (
                  <p className={style.error}>{errors.age.message}</p>
                )}
              </div>
            </li>
            <li className={style.list}>
              <div>
                <label>품종:</label>
                <input type="text" {...register("breed", { required: true })} />
              </div>
              <div>
                {errors.breed && (
                  <p className={style.error}>{errors.breed.message}</p>
                )}
              </div>
            </li>
          </div>
        </ul>
        <div className={style.button_wrap}>
          <Button type="submit" className={style.button}>
            프로필 생성하기
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePetProfile;
