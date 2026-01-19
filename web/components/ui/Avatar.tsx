interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Avatar({ 
  src, 
  alt, 
  name, 
  size = 'md',
  className = '' 
}: AvatarProps) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const colors = [
    'bg-solidarity-red',
    'bg-earth-green',
    'bg-sun-yellow',
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  const getColorForName = (name: string) => {
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={`rounded-full object-cover ${sizes[size]} ${className}`}
      />
    );
  }

  if (name) {
    return (
      <div
        className={`rounded-full flex items-center justify-center font-medium text-white ${sizes[size]} ${className}`}
        style={{ backgroundColor: '#2F5D3A' }}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className={`rounded-full bg-charcoal/20 ${sizes[size]} ${className}`}>
      <svg className="w-full h-full text-charcoal/40" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
}
