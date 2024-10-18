'use client'
import { Group, Input, rem, Space, Stack, Text } from '@mantine/core';
import { Dropzone, FileWithPath, PDF_MIME_TYPE } from '@mantine/dropzone';
import classes from './style.module.css';
import cx from 'clsx'
import { useEffect, useState } from 'react';
import { IconFile, IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import { createClient } from '@/supabase/lib/client';
import { v4 as uuid } from 'uuid';
import { showNotification } from '@mantine/notifications';
export default function UploadResume({ onChange, value, onUpload }: {
   onChange: (updater: string[]) => void
   onUpload: (updater: string) => void
   value?: string[] | null
}) {
   const [files, setFiles] = useState<FileWithPath[]>([]);
   const [isUploading, setIsUploading] = useState<boolean>(false);
   const [uploaded, setUploaded] = useState<FileWithPath[]>([])
   const [onError, setOnError] = useState<boolean>(false);
   const supabase = createClient()


   useEffect(() => {
      if (files.length === 0) return;
      const upload = async () => {
         setIsUploading(true)
         await Promise.all(
            files.map(async (file) => {
               if (uploaded.some((uploadedFile) => uploadedFile.name === file.name)) return;
               const { data: { user } } = await supabase.auth.getUser()
               setOnError(false)
               await supabase
                  .storage
                  .from('related')
                  .upload(`${user?.id}/resume/${uuid()}-${encodeURIComponent(file.name)}`, file, {
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
                           .from('related')
                           .getPublicUrl(data.path)
                        publicUrl && onUpload(publicUrl)
                     }
                  }).finally(() => {
                     setUploaded((prev) => [...prev, file])
                  })
            })

         ).finally(() => setIsUploading(false))


      }
      upload()
      return () => {
         setIsUploading(false)
      }
   }, [files])


   return (
      <Input.Wrapper label="Resume files" >
         <Dropzone
            maxFiles={3}
            disabled={uploaded.length === 3}
            loading={isUploading} accept={PDF_MIME_TYPE} onDrop={setFiles}
         >
            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
               <Dropzone.Accept>
                  <IconUpload
                     style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                     stroke={1.5}
                  />
               </Dropzone.Accept>
               <Dropzone.Reject>
                  <IconX
                     style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                     stroke={1.5}
                  />
               </Dropzone.Reject>
               <Dropzone.Idle>
                  <IconPhoto
                     style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                     stroke={1.5}
                  />
               </Dropzone.Idle>

               <div>
                  <Text size="xl" inline>
                     Drag PDF files here or click to select files
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                     Attach as many files as you like, each file should not exceed 5mb
                  </Text>
               </div>

            </Group>
         </Dropzone>
         <Stack mt='md'>

            {uploaded.map((item) => {
               return <div
                  className={cx(classes.item)}

               >
                  <IconFile size={50} stroke={1.5} />
                  <Space w="sm" />
                  <div>
                     <Text>{item.name}</Text>
                     <Text c="dimmed" size="sm">
                        Type: PDF • Size: {item.size} bytes
                     </Text>
                  </div>
               </div>
            })}
         </Stack>
      </Input.Wrapper>
   );
}