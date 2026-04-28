import { Composition } from "remotion";

// 본 플랜에서는 영상을 만들지 않고 placeholder Composition 1개만 등록.
// 플랜 2~3에서 실제 V0~V11을 추가한다.
const Placeholder: React.FC = () => null;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="placeholder"
        component={Placeholder}
        durationInFrames={30}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
