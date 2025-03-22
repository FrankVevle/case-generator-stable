import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface CategoryCardProps {
  title: string
  description: string
  imagePath: string
  color: string
}

export function CategoryCard({ title, description, imagePath, color }: CategoryCardProps) {
  return (
    <Card className="overflow-hidden border shadow-sm h-full">
      <CardContent className="p-6 flex flex-col items-center">
        <div className={`w-32 h-32 ${color} rounded-md mb-4 flex items-center justify-center`}>
          <Image
            src={imagePath || "/placeholder.svg"}
            alt={title}
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="font-medium">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

