import { Card, CardHeader, IconButton } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CustomMuiCardNode = ({title, subheader}) => {
	return (
		<Card sx={{ width: "400px", height: "100px" }}>
			<CardHeader
				title={title}
				subheader={subheader}
				action={
					<IconButton onClick={() => alert("copied to clipboard")}>
						<ContentCopyIcon />
					</IconButton>
				}
			/>
		</Card>
	)
}

export default CustomMuiCardNode;