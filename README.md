# arXiv Paper Search

A streamlined Streamlit web application for searching and exploring academic papers from arXiv, the world's largest open-access archive of scientific research.

## Overview

This application provides an intuitive interface to search arXiv's vast collection of academic papers across various scientific disciplines. Users can search by keywords, sort results by different criteria, and export findings for further analysis.

## Features

### Advanced Search Capabilities

- **Flexible Query Search**: Search using any keywords, topics, authors, or concepts
- **Multiple Sort Options**:
  - By Submitted Date
  - By Relevance
  - By Last Updated Date
- **Customizable Result Limits**: Retrieve between 5 to 100 papers per search

### Dual View Modes

- **Cards View**: Expandable cards displaying detailed paper information with full abstracts
- **Table View**: Compact tabular format for quick scanning of multiple papers

### Rich Paper Information

Each search result includes:

- Full paper title
- Complete author list
- Publication date
- Abstract (with truncation for readability in card view)
- Direct link to arXiv paper page
- Direct PDF download link

### Data Export

- **CSV Export**: Download search results as CSV files for offline analysis
- Timestamped filenames for easy organization

### User-Friendly Interface

- Clean, modern interface built with Streamlit
- Responsive layout that adapts to different screen sizes
- Persistent search results across view mode changes
- Session state management for seamless user experience

## Installation

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Setup Instructions

1. **Clone or download the repository**

   ```bash
   cd /path/to/arXiv\ Paper\ Search
   ```

2. **Create a virtual environment (recommended)**

   ```bash
   python -m venv venv

   # On Linux/Mac:
   source venv/bin/activate

   # On Windows:
   venv\Scripts\activate
   ```

3. **Install required dependencies**
   ```bash
   pip install streamlit arxiv pandas
   ```

## Usage

### Running the Application

Start the Streamlit application with:

```bash
streamlit run app.py
```

The application will automatically open in your default web browser at `http://localhost:8501`

### Using the Application

1. **Configure Search Settings** (Sidebar):
   - Adjust "Maximum Results" slider (5-100 papers)
   - Select sort criterion from dropdown menu

2. **Enter Search Query**:
   - Type your search terms in the search box
   - Example queries:
     - "efficient LLM fine-tuning"
     - "quantum computing algorithms"
     - "neural architecture search"
     - "climate change modeling"

3. **Execute Search**:
   - Click the "Search" button
   - Wait for results to load (indicated by spinner)

4. **View Results**:
   - **Cards View**: Click on any paper card to expand and read the full abstract
   - **Table View**: Browse papers in a compact table format with sortable columns

5. **Access Papers**:
   - Click "View on arXiv" to open the paper's arXiv page
   - Click "Download PDF" to directly download the PDF version

6. **Export Data**:
   - Click "Export CSV" button
   - Then click "Download CSV" to save results locally
   - Files are named with timestamp: `arxiv_papers_YYYYMMDD.csv`

## Dependencies

The application requires the following Python packages:

- **streamlit** (>=1.0.0): Web application framework
- **arxiv** (>=1.4.0): Python wrapper for arXiv API
- **pandas** (>=1.3.0): Data manipulation and CSV export

Install all dependencies at once:

```bash
pip install streamlit arxiv pandas
```

Or use a requirements.txt file:

```txt
streamlit>=1.0.0
arxiv>=1.4.0
pandas>=1.3.0
```

Then install with:

```bash
pip install -r requirements.txt
```

## Technical Details

### Architecture

- **Frontend**: Streamlit framework for reactive web interface
- **Data Source**: arXiv API via the Python arxiv library
- **State Management**: Streamlit session state for persistent data

### Key Components

#### Search Configuration

```python
arxiv.Search(
    query=query,
    max_results=max_results,
    sort_by=sort_criterion
)
```

#### Data Structure

Each paper is stored as a dictionary with:

- `title`: Paper title
- `authors`: Comma-separated author names
- `abstract`: Full paper abstract
- `date`: Publication date (YYYY-MM-DD)
- `url`: arXiv entry URL
- `pdf_url`: Direct PDF download URL

### Session State

Results are stored in `st.session_state.papers` to persist across user interactions without re-searching.

## Use Cases

- **Researchers**: Stay updated with latest publications in your field
- **Students**: Find relevant papers for literature reviews and assignments
- **Academics**: Explore emerging topics and methodologies
- **Data Scientists**: Collect paper metadata for bibliometric analysis
- **Librarians**: Curate reading lists and resource collections

## Tips for Better Searches

1. **Use Specific Terms**: More specific queries return more relevant results
2. **Try Different Sort Options**: Relevance for topical searches, Date for latest publications
3. **Adjust Result Limits**: Start with 20-50 results for initial exploration
4. **Export Regularly**: Save interesting search results as CSV for later reference
5. **Use Boolean Operators**: arXiv supports AND, OR, NOT in queries

## Limitations

- Search powered by arXiv API with standard rate limits
- No advanced filtering by journal, category, or citation count
- Abstract truncation in card view (first 500 characters)
- Requires internet connection for searches and API access

## Future Enhancements

Potential features for future versions:

- Category/subject area filtering
- Date range selection
- Author-specific searches
- Citation count display (if available via API)
- Bookmark/favorite papers functionality
- Search history tracking
- Advanced query builder interface
- Dark mode theme option

## Troubleshooting

### Common Issues

**Application won't start**

```bash
# Ensure Streamlit is installed correctly
pip install --upgrade streamlit
```

**Search returns no results**

- Check your internet connection
- Verify query syntax (arXiv search syntax)
- Try broader search terms

**Import errors**

```bash
# Reinstall all dependencies
pip install --force-reinstall streamlit arxiv pandas
```

**Port already in use**

```bash
# Run on different port
streamlit run app.py --server.port 8502
```

## Contributing

Feel free to fork this project and submit pull requests for improvements. Some areas for contribution:

- UI/UX enhancements
- Additional filtering options
- Performance optimizations
- Unit tests
- Documentation improvements

## License

This project is provided as-is for educational and research purposes. Please respect arXiv's terms of service when using this application.

## Acknowledgments

- **arXiv**: For providing free access to scientific research
- **Streamlit**: For the excellent web application framework
- **arxiv Python Library**: For the convenient API wrapper

## Contact & Support

For issues, questions, or suggestions, please open an issue on the project repository.
