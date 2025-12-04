declare module 'react-leaflet-cluster' {
    import { PropsWithChildren } from 'react';
    import { MarkerClusterGroupOptions } from 'leaflet';
    import { LayerGroupProps } from 'react-leaflet';

    interface MarkerClusterGroupProps extends MarkerClusterGroupOptions, LayerGroupProps {
        chunkedLoading?: boolean;
        maxClusterRadius?: number | ((zoom: number) => number);
    }

    const MarkerClusterGroup: React.FC<PropsWithChildren<MarkerClusterGroupProps>>;
    export default MarkerClusterGroup;
}
