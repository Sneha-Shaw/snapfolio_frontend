import { CardContainer, CardBody, CardItem } from '@/components/aceternity/ThreeDCard';
import { PixelatedCanvas } from '@/components/aceternity/PixelatedCanvas';
import { useTheme } from '@/context/ThemeContext';

interface AboutCardProps {
  imageUrl: string;
  name: string;
}

export function AboutCard({ imageUrl, name }: AboutCardProps) {
  const { theme } = useTheme();

  return (
    <CardContainer containerClassName="py-0">
      <CardBody className="elevated-card h-auto w-72 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 sm:w-80">
        <CardItem translateZ={60} className="w-full">
          <div
            role="img"
            aria-label={name}
            className="relative aspect-square w-full overflow-hidden rounded-xl bg-[var(--color-bg-elevated-2)]"
          >
            <PixelatedCanvas
              src={imageUrl}
              responsive
              className="h-full w-full"
              cellSize={5}
              dotScale={0.85}
              shape="circle"
              backgroundColor={theme.background}
              duotone={{ shadow: theme.background, highlight: theme.accent }}
              dropoutStrength={0.32}
              distortionMode="repel"
              distortionStrength={4}
              distortionRadius={80}
              jitterStrength={1}
              jitterSpeed={1.2}
            />
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
