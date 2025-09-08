import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/', '/_next/', '/private/'],
        },
        sitemap: 'https://typologylab.com/sitemap.xml',
    };
}
