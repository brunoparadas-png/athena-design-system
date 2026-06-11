import React from 'react'
import { FileUploader } from './FileUploader'
import figma from '@figma/code-connect'

figma.connect(
  FileUploader,
  'https://www.figma.com/design/GdVwZerTIEXazbhDQlhwRP/Athena-Design-System--Trial-?node-id=703-13044',
  {
    props: {},
    example: () => (
      <FileUploader
        buttonLabel="Upload file"
        message="PNG, JPG or PDF up to 10 MB"
        onUpload={files => console.log(files)}
      />
    ),
  },
)
