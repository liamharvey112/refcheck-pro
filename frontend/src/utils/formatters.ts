export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) {
        return text;
    }

    return text.substring(0, maxLength) + '...';
};

export const getRiskColor = (risk: string): 'success' | 'warning' | 'danger' | 'default' => {
    switch (risk) {
        case 'Low': 
            return 'success';
        case 'Medium': 
            return 'warning';
        case 'High': 
            return 'danger';
        default: 
            return 'default';
    }
};

export const getRiskClass = (risk: string): string => {
    switch (risk) {
        case 'Low': 
            return 'bg-green-100 text-green-800';
        case 'Medium': 
            return 'bg-yellow-100 text-yellow-800';
        case 'High': 
            return 'bg-red-100 text-red-800';
        default: 
            return 'bg-gray-100 text-gray-800';
    }
};