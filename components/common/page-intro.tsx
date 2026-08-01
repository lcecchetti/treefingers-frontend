export interface PageIntroProps {
  children?: React.ReactNode;
}

export const PageIntro = ({ children }: PageIntroProps) => {
  return (
    <div className="mt-sm mb-md lg:my-md flex flex-col gap-sm">
      {children}
    </div>
  );
};
