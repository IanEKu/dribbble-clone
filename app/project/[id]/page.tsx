import { ProjectInterface } from '@/common.types'
import Modal from '@/components/Modal'
import ProjectActions from '@/components/ProjectActions'
import RelatedProjects from '@/components/RelatedProjects'
import { getProjectDetails } from '@/lib/actions'
import { getCurrentUser } from '@/lib/session'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Project = async ({params : {id}} : {params: {id: string}}) => {
    const session = await getCurrentUser()
    const result = await getProjectDetails(id) as {project?: ProjectInterface}

    if (!result.project) {
        return (
            <p className="text-xl">Failed to fetch information</p>
        )
    } else {
        const project = result.project
    
        return (
            <Modal>
                <section className='flexBetween gap-y-8 max-w-4xl max-xs:flex-col w-full'>
                    <div className="flex-1 flex items-start gap-5 w-full max-xs:flex-col">
                        <Link href={`/profile/${project.createdBy.id}`}>
                            <Image
                                src={project.createdBy.avatarUrl}
                                width={40}
                                height={40}
                                alt='Creator'
                                className='rounded-full mr-4'
                            />
                        </Link>
                        <div className="flex-1 flexStart flex-col gap-1">
                            <p className="self-start text-lg font-semibold">{project.title}</p>
                            <div className="user-info">
                                <Link href={`/profile/${project.createdBy.id}`}>
                                    {project.createdBy.name}
                                </Link>
                                <Image src="/dot.svg" width={4} height={4} alt='dot' />
                                <Link href={`/?category=${project.category}`} className="text-primary-purple font-semibold">
                                    {project.category}
                                </Link>
                            </div>
                        </div>
                    </div>
                        
                    {
                        session.user.email === project.createdBy.email && (
                            <div className="flex justify-end items-center gap-2">
                                <ProjectActions
                                    projectId={project.id}
                                />
                            </div>
                        )
                    }
                </section>

                <section className="mt-14">
                    <Image
                        src={project.image}
                        alt='Project Image'
                        width={1064}
                        height={798}
                        className='object-cover rounded-2xl'
                    />
                </section>

                <section className="flexCenter flex-col mt-20">
                    <p className="max-w-5xl text-xl font-normal">{project.description}</p>
                    <div className="flex flex-wrap mt-5 gap-5">
                        <Link href={project.githubUrl}>
                            👩‍💻 Github
                        </Link>
                        <Link href={project.githubUrl}>
                            🚀 Live Site
                        </Link>
                    </div>

                </section>

                <section className="flexCenter w-full gap-8 mt-28">
                    <span className="w-full h-0.5 bg-light-white-200"></span>
                    <Image 
                        src={project.createdBy.avatarUrl}
                        width={65}
                        height={65}
                        alt='Creator'
                        className='rounded-full mx-4'
                    />
                    <span className="w-full h-0.5 bg-light-white-200"></span>
                </section>

                <RelatedProjects
                    userId={project.createdBy.id}
                    projectId={project.id}
                />
            </Modal>
        )
    }
}

export default Project