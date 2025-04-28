interface Props {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: Props) {
  return <h3>Product Detail: {params.slug}</h3>;
}
