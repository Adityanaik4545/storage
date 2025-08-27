"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { getFiles } from '@/lib/actions/file.actions'
import { Models } from 'node-appwrite'
import Thumbnail from './Thumbnail'
import FormattedDateTime from './FormattedDateTime'
import { useDebounce } from 'use-debounce';


const Search = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || " ";
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname()
  const [debounceQuery] = useDebounce(query, 1000);

  useEffect(() => {
    const fetchFiles = async () => {
      if (debounceQuery.length===0) {
        setResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(),""))
      }
      const files = await getFiles({ types:[], searchText: debounceQuery });
      setResults(files.documents);
      setOpen(true);
    }
    fetchFiles();
  }, [debounceQuery])

  useEffect(() => {
    if (!searchQuery) {
      setQuery("")
    }
  }, [searchQuery])

  const handleClickItem = (file:Models.Document) =>{
      setOpen(false);
      setResults([]);

      router.push(`/${file.type==="video" || file.type==="audio" ? "media":file.type + "s"}?query=${query}`)
  }

  return (<div className='search' >
    <div className='search-input-wrapper'>
      <Image src="assets/icons/search.svg" width={24} height={24} alt='search' />
      <Input value={query} placeholder='search...' className='search-input' onChange={(e) => setQuery(e.target.value)} />
      {open && (
        <ul className='search-result'>
          {results.length > 0 ? (
            results.map((file) => (
              <li 
              className="flex items-center justify-between"
              key={file.$id} 
              onClick={()=>handleClickItem(file)}
              >
                <div className="flex cursor-pointer items-center gap-4" >
                  <Thumbnail 
                  type={file.type} 
                  extension={file.extension} 
                  url={file.url} 
                  className='size-9 min-w-9' 
                  />
                  <p className="line-clamp-1 subtitle-2 text-light-100">
                    {file.name}
                  </p>
                </div>
                <FormattedDateTime date={file.$createdAt} className='caption line-clamp-1 text-light-200' />
              </li>
              ))
          ) : (
            <p className='empty-result'>
              No files
            </p>
          )}
        </ul>
      )}
    </div>
  </div>
  )
}

export default Search
