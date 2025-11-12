type Props = { className?: string; alt?: string };

const Logo = ({ className = "w-14 h-14", alt = "App logo" }: Props) => {
  // Use the shared app icon so branding is consistent across web and native
  return <img src="/icon.svg" alt={alt} className={className} />;
};

export default Logo;
