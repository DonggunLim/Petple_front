import { ChangeEvent, FC, KeyboardEvent, useState } from "react";
import { useChipContext } from "./Root";
import { InputProps } from "../types";

const Input: FC<InputProps> = ({
  className,
  placeholder = "#태그 작성후 Enter를 눌러주세요.",
}) => {
  const [value, setValue] = useState<string>("");
  const { items, maxItemLength, maxItemsCount, addItem, isValidInput } =
    useChipContext();
  const hanldeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (maxItemLength < value.length || maxItemsCount === items.length) {
      return;
    }
    setValue(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!isValidInput(value)) {
        setValue("");
        return;
      }
      addItem(value);
      setValue("");
    }
  };

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={hanldeChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />
    </>
  );
};

export default Input;
