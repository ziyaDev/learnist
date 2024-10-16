'use client'
import { AspectRatio, Flex, SimpleGrid, Text } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import classes from './style.module.css';
import { useEffect, useState } from 'react';
import Image from "next/image";
import { IconPlus } from '@tabler/icons-react';
import { createClient } from '@/supabase/lib/client';
import { showNotification } from '@mantine/notifications';
export default function UploadAvatar({ onChange, value }: {
   onChange: (value: string) => void
   value?: string | null
}) {
   const [files, setFiles] = useState<FileWithPath[]>([]);
   const [isUploading, setIsUploading] = useState<boolean>(false);
   const [onError, setOnError] = useState<boolean>(false);
   const supabase = createClient()


   useEffect(() => {
      if (files.length === 0) return;
      const avatarFile = files[0]
      const upload = async () => {
         setIsUploading(true)
         const { data: { user } } = await supabase.auth.getUser()
         setOnError(false)
         await supabase
            .storage
            .from('avatars')
            .upload(`${user?.id}/${avatarFile.name}`, avatarFile, {
               cacheControl: '3600',
               upsert: false
            }).then(({ data, error }) => {
               if (error) {
                  showNotification({
                     title: "Upload failed",
                     position: "top-right",
                     color: "red",
                     message: error.message,
                  })
                  return;
               }
               if (data) {
                  const { data: { publicUrl } } = supabase
                     .storage
                     .from('avatars')
                     .getPublicUrl(data.path)

                  publicUrl && onChange(publicUrl)
               }
            }).finally(() => {
               setIsUploading(false)
               setFiles([])
            })

      }
      upload()
      return () => {
         setIsUploading(false)
      }
   }, [files])


   return (
      <div>

         <Dropzone loading={isUploading} accept={IMAGE_MIME_TYPE} onDrop={setFiles} className={classes.root}>
            {!!value ? <AspectRatio ratio={1 / 1} maw={300} >
               <Image alt='' fill sizes='300' style={{ objectFit: "cover" }} src={value} />
            </AspectRatio> :
               <Flex direction={"column"} gap={2} align={"center"} justify={"center"} pt='xs'>
                  <IconPlus size={20} />
                  <Text size={"xs"}>ADD</Text>
               </Flex>
            }

         </Dropzone>
      </div>
   );
}