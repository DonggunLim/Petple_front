import resizeImage from "@/utils/resizeImage";
import { ChangeEvent, useRef, useState } from "react";

interface UseFileInputProps {
  images?: Array<string>;
  setFormValue?: (fieldName: "images", value: Array<File | string>) => void;
  setFormError?: (fieldName: "images", error: string | null) => void;
}

const useFileInput = ({
  images,
  setFormValue,
  setFormError,
}: UseFileInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileList, setFileList] = useState<Array<File | string>>(images ?? []);

  const handleChangeFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const promises = Array.from(e.target.files).map((file) =>
      resizeImage(file)
    );
    const resizedFiles = await Promise.all(promises);
    const updatedFiles = [...fileList, ...resizedFiles];
    if (updatedFiles.length > 10) {
      setFormError?.("images", "최대 10장까지 등록할 수 있습니다.");
      return;
    } else {
      setFormError?.("images", null);
    }

    setFileList(updatedFiles);
    setFormValue?.("images", updatedFiles);
  };

  const handleDeleteImages = (index: number) => {
    const updatedFiles = fileList.filter((_, i) => i !== index);
    setFileList(updatedFiles);
    setFormValue?.("images", updatedFiles);

    if (updatedFiles.length <= 10) {
      setFormError?.("images", null);
    }
  };

  return {
    fileInputRef,
    fileList,
    handleChangeFileInput,
    handleDeleteImages,
  };
};

export default useFileInput;
