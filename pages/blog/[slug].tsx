import { getAllPostsMeta, getPostBySlug } from "@/lib/mdx"
import { Button } from "@/ui/Button"
import { Layout } from "@/ui/Layout"
import { LikeButton } from "@/ui/LikeButton"
import { components } from "@/ui/MdxComponents"
import { format, parseISO } from "date-fns"
import { getMDXComponent } from "mdx-bundler/client"
import { GetStaticProps } from "next"
import Image from "next/image"
import React from "react"
import type { Post } from "types/post"

export const getStaticPaths = () => {
  const posts = getAllPostsMeta()
  const paths = posts.map(({ slug }) => ({ params: { slug } }))

  return {
    paths: paths,
    // Return 404 page if path is not returned by getStaticPaths
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Post> = async (context) => {
  const slug = context.params?.slug as string
  const post = await getPostBySlug(slug)

  return { props: post }
}

export default function PostPage({ meta, code }: Post) {
  // This is a bit weird, but this is how mdx-bundler recommends it.
  const Component = React.useMemo(() => getMDXComponent(code), [code])

  return (
    <Layout>
      <div className="container max-w-3xl px-4 mx-auto mt-36">
        <h1 className="text-2xl font-extrabold md:text-3xl">{meta.title}</h1>

        <div className="flex items-center mt-4 space-x-2 text-gray-500">
          <Image
            src="/avatar.jpg"
            height={24}
            width={24}
            className="rounded-full"
          />

          <div>Delba de Oliveira</div>

          <div className="text-gray-300">&middot;</div>

          <div>{format(parseISO(meta.publishedAt), "MMMM dd, yyyy")}</div>
        </div>

        <div className="mt-12">
          <Component components={components as any} />
        </div>

        <div className="flex justify-center mt-16 space-x-8">
          {meta.source ? (
            <Button href={meta.source} target="_blank">
              View Source Code
            </Button>
          ) : null}
          <LikeButton id={meta.slug} />
        </div>
      </div>
    </Layout>
  )
}
