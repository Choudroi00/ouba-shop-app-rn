export type Advertisment = {
    id?: number;

    title: string;
    target: 'vendor' | 'customer';
    resource_url: string | null;
    resource_file?: File | null;
    type: 'banner' | 'video';
    timeout: number;
}