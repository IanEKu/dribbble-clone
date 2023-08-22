"use client"

import { SessionInterface } from '@/common.types'
import Image from 'next/image'
import { ChangeEvent, useEffect, useState } from 'react'
import FormField from './FormField'
import { categoryFilters } from '@/constants'
import CustomMenu from './CustomMenu'
import Button from './Button'

type Props = {
    type: string,
    session: SessionInterface
}

const ProjectForm = ({type, session}: Props) => {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState({
        image: "",
        title: "",
        description: "",
        liveSiteUrl: "",
        githubUrl: "",
        category: "",
    })

    const handleStateChange = (fieldName: string, value: string) => {
        setForm(prevState => ({...prevState, [fieldName]: value}))
    }

    const handleFormSubmit = (e: React.FormEvent) => {}
    
    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const file = e.target.files?.[0]
        if (!file) return alert('Image failed to upload')

        if (!file.type.includes('image')) return alert('Please upload an image file')

        const reader = new FileReader()

        reader.readAsDataURL(file)

        reader.onload = () => {            
            const result = reader.result as string

            handleStateChange('image', result)
        }
    }

  return (
    <form
        onSubmit={handleFormSubmit}
        className='flexStart form'
    >
        <div className="flexStart form_image-container">
            <label htmlFor="poster" className='flexCenter form_image-label'>
                {!form.image && 'Choose a poster for your project'}
            </label>
            <input 
                type="file"
                id="image"
                accept='image/'
                required={type === 'create'} 
                className='form_image-input'
                onChange={handleChangeImage}
            />
            {form.image &&
                <Image
                    src={form.image}
                    className='sm:p-10 object-contain z-20'
                    alt='Project poster'
                    fill
                />
            }
        </div>

        <FormField
            title="Title"
            state={form.title}
            placeholder="Flexibble"
            setState={(value: string) => handleStateChange('title', value)}
        />
        <FormField
            title="Description"
            state={form.description}
            placeholder="Showcase and discover remarkable developer projects"
            setState={(value: string) => handleStateChange('description', value)}
        />
        <FormField
            type='url'
            title="Website URL"
            state={form.liveSiteUrl}
            placeholder="https://flexibble.com"
            setState={(value: string) => handleStateChange('liveSiteUrl', value)}
        />
        <FormField
            type='url'
            title="Github URL"
            state={form.githubUrl}
            placeholder="https://github.com/ianeku"
            setState={(value: string) => handleStateChange('githubUrl', value)}
        />

        <CustomMenu
            title="Category"
            state={form.category}
            filter={categoryFilters}
            setState={(value: string) => handleStateChange('category', value)}
        />

        <div className="flexStart w-full">
            <Button
                title={isSubmitting 
                        ? `${type === 'create' ? "Creating" : "Editing"}`
                        : `${type === 'create' ? "Create" : "Edit"}`
                    }
                type="submit"
                leftIcon={isSubmitting ? "" : '/plus.svg'}
                isSubmitting={isSubmitting}
            />
        </div>
    </form>
  )
}

export default ProjectForm