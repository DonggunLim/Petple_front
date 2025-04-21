import styles from "./postform.module.css";
import ChipInput from "@/components/UI/ChipInput";
import { ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormHeader from "./components/FormHeader";
import { PostFormData, PostFormFields } from "@/types/post.type";
import { postFormSchema } from "@/consts/zodSchema";
import UploadIcon from "@/assets/icons/upload.svg?react";
import useFileInput from "@/hooks/useFileInput";

interface PostFormProps {
  post?: PostFormData;
  requestType: "create" | "update";
  isButtonDisabled?: boolean;
  onSubmit: (data: PostFormFields) => void;
  onClickDelete?: () => void;
}

const PostForm = ({
  requestType,
  post,
  isButtonDisabled,
  onSubmit,
  onClickDelete,
}: PostFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<PostFormFields>({
    defaultValues: {
      tags: post?.tags ?? [],
      images: post?.images ?? [],
      description: post?.description ?? "",
    },
    resolver: zodResolver(postFormSchema),
    mode: "onSubmit",
  });
  const { fileInputRef, fileList, handleDeleteImages, handleChangeFileInput } =
    useFileInput({
      images: post?.images,
      setFormValue: (fieldName, value) =>
        setValue(fieldName, value, { shouldDirty: true }),
      setFormError: (fieldName, error) => {
        if (error) {
          setError(fieldName, { message: error }, { shouldFocus: false });
        } else {
          clearErrors(fieldName);
        }
      },
    });

  const handleResizeHeight = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };
  return (
    <>
      <FormHeader
        onClickSubmit={handleSubmit((data) => {
          if (!isDirty) return;
          onSubmit(data);
        })}
        onClickDelete={onClickDelete}
        reqeustType={requestType}
        isButtonDisabled={isButtonDisabled}
      />
      <form className={styles.form}>
        <Controller
          name="tags"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange } }) => {
            return (
              <>
                <ChipInput onChange={onChange} values={post?.tags} />
                {errors.tags && (
                  <p className={styles.error}>{errors.tags.message}</p>
                )}
              </>
            );
          }}
        />
        <input
          type="file"
          accept="image/*"
          multiple
          {...register("images")}
          ref={(e) => {
            register("images").ref(e);
            fileInputRef.current = e;
          }}
          onChange={handleChangeFileInput}
          className={styles.hiddenFileInput}
        />
        <ul className={styles.fileUpload_container}>
          <li
            className={styles.uploaded_file}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon />
          </li>
          {fileList.map((file, index) => (
            <li
              className={styles.uploaded_file}
              key={`preview-image-${index}`}
              onClick={() => handleDeleteImages(index)}
            >
              <img
                src={`${
                  typeof file === "string" ? file : URL.createObjectURL(file)
                }`}
                alt="업로드 버튼"
                className={styles.previewImage}
              />
            </li>
          ))}
        </ul>
        <p className={styles.info}>* 최대 10장까지 등록 가능합니다.</p>
        {errors.images && (
          <p className={styles.error}>{errors.images.message}</p>
        )}
        <textarea
          id="description"
          maxLength={5000}
          placeholder="내용을 입력해주세요"
          className={styles.description}
          onInput={handleResizeHeight}
          {...register("description")}
        ></textarea>
        {errors.description && (
          <p className={styles.error}>{errors.description.message}</p>
        )}
      </form>
    </>
  );
};

export default PostForm;
