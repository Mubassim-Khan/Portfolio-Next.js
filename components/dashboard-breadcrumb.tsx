"use client"

import { usePathname } from "next/navigation"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function DashboardBreadcrumb() {
    const pathname = usePathname()
    const segments = pathname.split("/").filter(Boolean) // remove empty parts

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    const href = "/" + segments.slice(0, index + 1).join("/")
                    const isLast = index === segments.length - 1
                    const label =
                        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")

                    return (
                        <BreadcrumbItem key={href}>
                            {!isLast ? (
                                <>
                                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                                    <BreadcrumbSeparator />
                                </>
                            ) : (
                                <BreadcrumbPage>{label}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
