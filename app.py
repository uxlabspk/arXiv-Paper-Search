import streamlit as st
import arxiv
import pandas as pd
from datetime import datetime

st.set_page_config(page_title="arXiv Paper Search", page_icon="📚", layout="wide")

st.title("arXiv Paper Search")
st.markdown("Search for recent papers on arXiv and explore the results")

# Sidebar
with st.sidebar:
    st.header("Settings")
    max_results = st.slider("Maximum Results", min_value=5, max_value=100, value=20)
    
    sort_options = {
        "Submitted Date": arxiv.SortCriterion.SubmittedDate,
        "Relevance": arxiv.SortCriterion.Relevance,
        "Last Updated": arxiv.SortCriterion.LastUpdatedDate
    }
    sort_by = st.selectbox("Sort By", options=list(sort_options.keys()))


query = st.text_input("Search Query", value="efficient LLM fine-tuning")

search_button = st.button("Search", type="primary")

if search_button or 'papers' in st.session_state:
    if search_button:
        with st.spinner("Searching arXiv..."):
            try:
                search = arxiv.Search(
                    query=query,
                    max_results=max_results,
                    sort_by=sort_options[sort_by]
                )
                
                papers = [{
                    "title": r.title,
                    "authors": ", ".join([a.name for a in r.authors]),
                    "abstract": r.summary,
                    "date": r.published.strftime("%Y-%m-%d"),
                    "url": r.entry_id,
                    "pdf_url": r.pdf_url
                } for r in search.results()]
                
                st.session_state.papers = papers
                st.success(f"Found {len(papers)} papers!")
                
            except Exception as e:
                st.error(f"Error during search: {str(e)}")
                st.stop()
    
    papers = st.session_state.papers
    
    # Display options
    col1, col2 = st.columns([12, 1])
    with col1:
        view_mode = st.radio("View Mode", ["Cards", "Table"], horizontal=True)
    with col2:
        if st.button("Export CSV"):
            df = pd.DataFrame(papers)
            csv = df.to_csv(index=False)
            st.download_button(
                label="Download CSV",
                data=csv,
                file_name=f"arxiv_papers_{datetime.now().strftime('%Y%m%d')}.csv",
                mime="text/csv"
            )
    
    st.markdown("---")
    
    # Display results
    if view_mode == "Cards":
        for i, paper in enumerate(papers, 1):
            with st.expander(f"**{i}. {paper['title']}**", expanded=(i==1)):
                st.markdown(f"**Authors:** {paper['authors']}")
                st.markdown(f"**Published:** {paper['date']}")
                st.markdown(f"**Abstract:** {paper['abstract'][:500]}..." if len(paper['abstract']) > 500 else f"**Abstract:** {paper['abstract']}")
                
                col1, col2 = st.columns([9, 1])
                with col1:
                    st.link_button("View on arXiv", paper['url'])
                with col2:
                    st.link_button("Download PDF", paper['pdf_url'])
    else:
        df = pd.DataFrame(papers)

        df_copy = df.copy()
        df_copy = df_copy.drop(columns=["abstract", "url"])

        st.dataframe(
            df_copy,
            use_container_width=True,
            hide_index=True,
            column_config={
                "pdf_url": st.column_config.LinkColumn(
                    "PDF",
                    display_text="Download"
                ),
            },
        )