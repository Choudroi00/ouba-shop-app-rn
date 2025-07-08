export type Advertisment = {
    id: number;
    title: string;
    resource_url: string;
    resource_type: 'banner' | 'video';
    timeout: number;
}