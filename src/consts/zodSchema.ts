import { z } from "zod";

export const petSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해주세요")
    .max(10, "이름은 10글자 미만이어야 합니다.")
    .default(""),
  age: z
    .string()
    .min(1, "나이를 입력해주세요")
    .max(3, "나이는 3글자 이하로 입력해주세요.")
    .regex(/^\d+$/, "숫자만 입력해주세요.")
    .default(""),
  breed: z
    .string()
    .min(1, "품종을 입력해주세요")
    .max(10, "품종은 10글자 미만이어야 합니다.")
    .default(""),
});

export const userSchema = z.object({
  nickName: z
    .string()
    .min(1, "닉네임을 입력해주세요.")
    .max(10, "닉네임은 10글자 이하로 입력해주세요."),
});

export const postFormSchema = z.object({
  tags: z
    .array(z.string())
    .min(1, "최소 1개 이상의 태그를 입력하세요.")
    .max(10, "최대 10개의 태그만 추가할 수 있습니다."),
  images: z.array(z.union([z.string(), z.instanceof(File)])),
  description: z.string().trim().min(1, "내용을 입력해주세요."),
});

export const CommentSchema = z.object({
  content: z.string().trim().min(1, "내용을 입력해주세요."),
});
