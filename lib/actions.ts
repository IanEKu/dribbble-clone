import { ProjectForm } from "@/common.types";
import { createProjectMutation, createUserMutation, deleteProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsQuery, projectsQueryFilter, updateProjectMutation } from "@/graphql";
import { GraphQLClient } from "graphql-request";

const isProduction = process.env.NODE_ENV === 'production'
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql'
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : 'lemmein'
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000'

const client = new GraphQLClient(apiUrl, {headers: {'x-api-key': apiKey}})

export const makeGraphQLRequest = async (query: string, variables = {}) => {
    try {
        return await client.request(query, variables)
    } catch (error) {
        throw error
    }
}

export const getUser= (email: string) => {
    return makeGraphQLRequest(getUserQuery, {email: email})
}

export const createUser= (name: string, email: string, avatarUrl: string) => {
    const variables = {
        input: {
            name, email, avatarUrl
        }
    }
    return makeGraphQLRequest(createUserMutation, variables)
}

export const fetchToken =async () => {
    try {
        const response = await fetch(`${serverUrl}/api/auth/token`)
        return response.json()
    } catch (error) {
        throw error
    }
}

export const uploadImage = async (imagePath:string) => {
    try {
        const response = await fetch(`${serverUrl}/api/upload`, {
            method: 'POST',
            body: JSON.stringify({path: imagePath})
        })

        return response.json()
    } catch (error) {
        return error
    }
}

export const createNewProject = async (form: ProjectForm, creatorId: string, token: string) => {
    const imageUrl = await uploadImage(form.image);

    if (imageUrl.url) {
        client.setHeader("Authorization", `Bearer ${token}`)

        const variables = {
            input: {
                ...form,
                image: imageUrl.url,
                createdBy: {
                    link: creatorId
                }
            }
        }

        return makeGraphQLRequest(createProjectMutation, variables)
    }
}

export const fetchAllProjects =async (category?: string, endcursor?: string) => {
    const query = category ? projectsQueryFilter : projectsQuery
    const variable = {category, endcursor}

    return makeGraphQLRequest(query, variable)
}

export const getProjectDetails = (id: string) => {
    return makeGraphQLRequest(getProjectByIdQuery, {id})   
}

export const getUserProjects = (id: string, last?: number) => {
    return makeGraphQLRequest(getProjectsOfUserQuery, {id, last})   
}

export const deleteProject = (id: string, token: string) => {
    return makeGraphQLRequest(deleteProjectMutation, {id})   
}

export const updateProject = async (form: ProjectForm, projectId: string, token: string) => {
    function isBase64DataURL(value: string) {
        const base64Regex = /^data:image\/[a-z]+;base64,/;
        return base64Regex.test(value);
    }

    let updatedForm = {...form}

    const isUploadingNewImage = isBase64DataURL(form.image)

    if(isUploadingNewImage) {
        const imageUrl = await uploadImage(form.image)

        if (imageUrl.url) {
            updatedForm = {
                ...form,
                image: imageUrl.url
            }
        }
    }

    const variables = {
        id: projectId,
        input: updatedForm
    }

    client.setHeader("Authorization", `Bearer ${token}`)

    return makeGraphQLRequest(updateProjectMutation, variables)
}