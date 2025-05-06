import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const users = [
  {
    id: 1,
    name: "Carlos Martínez",
    avatar: "/placeholder.svg?height=40&width=40",
    reports: 12,
    neighborhood: "El Poblado",
  },
  {
    id: 2,
    name: "María López",
    avatar: "/placeholder.svg?height=40&width=40",
    reports: 8,
    neighborhood: "Granada",
  },
  {
    id: 3,
    name: "Juan Pérez",
    avatar: "/placeholder.svg?height=40&width=40",
    reports: 15,
    neighborhood: "San Fernando",
  },
  {
    id: 4,
    name: "Ana Gómez",
    avatar: "/placeholder.svg?height=40&width=40",
    reports: 6,
    neighborhood: "Ciudad Jardín",
  },
]

export default function UsersSection() {
  return (
    <section className="py-16 bg-gray-50" id="usuarios">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Usuarios Destacados</h2>
          <p className="mt-4 text-lg text-gray-600">Ciudadanos comprometidos con el mejoramiento de Cali</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.neighborhood}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {user.reports} reportes
                  </Badge>
                  <button className="text-sm text-emerald-600 hover:text-emerald-700">Ver perfil</button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button className="text-emerald-600 hover:text-emerald-700 font-medium">Ver todos los usuarios →</button>
        </div>
      </div>
    </section>
  )
}
