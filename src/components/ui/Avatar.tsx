'use client';

import Image from 'next/image';

interface AvatarProps {
  name: string;
  initials?: string;
  size?: number;
  className?: string;
  variant?: 'profile' | 'chat';
}

// Gender detection based on common first names
function detectGender(name: string): 'male' | 'female' {
  const firstName = name.split(' ')[0].toLowerCase();

  // Common male names
  const maleNames = [
    'david', 'michael', 'christopher', 'james', 'john', 'robert', 'william',
    'richard', 'joseph', 'thomas', 'charles', 'daniel', 'matthew', 'anthony',
    'mark', 'donald', 'steven', 'paul', 'andrew', 'joshua', 'kenneth', 'kevin',
    'brian', 'george', 'timothy', 'ronald', 'edward', 'jason', 'jeffrey', 'ryan'
  ];

  // Common female names
  const femaleNames = [
    'jennifer', 'jessica', 'sarah', 'emily', 'amanda', 'melissa', 'michelle',
    'kimberly', 'lisa', 'angela', 'stephanie', 'heather', 'nicole', 'amy',
    'mary', 'patricia', 'linda', 'barbara', 'elizabeth', 'susan', 'karen',
    'nancy', 'betty', 'helen', 'sandra', 'donna', 'carol', 'ruth', 'sharon'
  ];

  if (maleNames.includes(firstName)) return 'male';
  if (femaleNames.includes(firstName)) return 'female';

  // Default to male for neutral/unknown names (Jordan, Taylor, etc.)
  return 'male';
}

// Get appropriate avatar style based on gender
function getAvatarStyle(name: string): string {
  const gender = detectGender(name);
  // DiceBear styles:
  // - "lorelei" for female (professional, diverse)
  // - "avataaars" for male (professional, customizable)
  return gender === 'female' ? 'lorelei' : 'avataaars';
}

export function Avatar({
  name,
  initials: _initials = 'SC', // eslint-disable-line @typescript-eslint/no-unused-vars
  size = 40,
  className = '',
  variant = 'profile'
}: AvatarProps) {
  // Generate consistent avatar URL using DiceBear API with gender-appropriate style
  const seed = name.toLowerCase().replace(/\s+/g, '-');
  const style = getAvatarStyle(name);
  const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=7c3aed&backgroundType=solid`;

  const sizeClass = variant === 'chat' ? 'w-8 h-8' : 'w-10 h-10';

  return (
    <div
      className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0 bg-primary ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <Image
        src={avatarUrl}
        alt={`${name}'s avatar`}
        width={size}
        height={size}
        className="w-full h-full object-cover"
        unoptimized // DiceBear SVGs don't need Next.js optimization
      />
    </div>
  );
}
